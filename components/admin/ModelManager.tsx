'use client';

import { useState, useRef, useEffect } from 'react';
import { addModel, updateModel, deleteModel, reorderModels, addVariant, updateVariant, deleteVariant } from '@/actions/admin';
import { uploadImage } from '@/actions/upload';
import { Trash2, Plus, Loader2, Upload, Pencil, X, GripVertical, Ban } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Variant } from '@/lib/store';

interface Brand {
    id: string;
    name: string;
}

interface Model {
    id: string;
    brandId: string;
    name: string;
    img: string;
    category?: string;
    priority?: number;
}

const CATEGORIES = [
    { id: 'smartphone', label: 'Smartphone' },
    { id: 'tablet', label: 'Tablet' },
    { id: 'smartwatch', label: 'Smartwatch' },
    { id: 'laptop', label: 'Laptop' },
    { id: 'console', label: 'Gaming Console' },
    { id: 'tv', label: 'Smart TV' },
    { id: 'repair-device', label: 'Repair Device' },
];

// Sortable Item Component
function SortableModel({ model, brands, variants, onEdit, onDelete }: { model: Model, brands: Brand[], variants: Variant[], onEdit: (m: Model) => void, onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: model.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const modelVariants = variants.filter(v => v.modelId === model.id);
    const minPrice = modelVariants.length > 0 ? Math.min(...modelVariants.map(v => v.basePrice)) : 0;
    const maxPrice = modelVariants.length > 0 ? Math.max(...modelVariants.map(v => v.basePrice)) : 0;

    return (
        <div ref={setNodeRef} style={style} className="p-4 border rounded-xl flex items-center justify-between bg-card touch-none relative group transition-shadow hover:shadow-md">

            <div className="flex items-center gap-4 relative z-10 pointer-events-none w-full mr-16">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="p-2 -ml-2 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing pointer-events-auto shrink-0">
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="w-12 h-12 relative bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {model.img && (model.img.startsWith('/') || model.img.startsWith('http')) ? (
                        <Image src={model.img} alt={model.name} fill className="object-cover" />
                    ) : (
                        <span className="text-xl font-bold text-gray-400">{model.name[0]}</span>
                    )}
                </div>

                <div className="overflow-hidden">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-sm md:text-base truncate">{model.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>{brands.find(b => b.id === model.brandId)?.name}</span>
                            {modelVariants.length > 0 && (
                                <span className="text-primary font-medium bg-primary/10 px-1.5 rounded-sm">
                                    {modelVariants.length} Variants (Starting ₹{minPrice.toLocaleString()})
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 relative z-20 pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2">
                <button
                    onClick={() => onEdit(model)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors bg-card border shadow-sm"
                    title="Edit Model & Pricing"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(model.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors bg-card border shadow-sm"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Local Variant Type for Form
// Needs id for tracking updates/deletes, but might be temp id for new ones
type FormVariant = {
    id: string; // real ID or `temp-${random}`
    name: string;
    basePrice: number;
    isNew?: boolean;
    isDeleted?: boolean;
}

export default function ModelManager({ initialModels, initialVariants = [], brands, preselectedCategory }: { initialModels: Model[], initialVariants?: Variant[], brands: Brand[], preselectedCategory?: string }) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [brandId, setBrandId] = useState(brands[0]?.id || '');
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [category, setCategory] = useState(preselectedCategory || 'smartphone');

    // Variants Form State
    const [formVariants, setFormVariants] = useState<FormVariant[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter / Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [models, setModels] = useState(initialModels);

    useEffect(() => {
        const sorted = [...initialModels].sort((a, b) => (a.priority || 100) - (b.priority || 100));
        setModels(sorted);
    }, [initialModels]);

    const visibleModels = models.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setModels((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                const updates = newItems.map((model, index) => ({ id: model.id, priority: index + 1 }));
                reorderModels(updates);
                return newItems;
            });
        }
    };

    const handleEdit = (model: Model) => {
        setEditingId(model.id);
        setBrandId(model.brandId);
        setName(model.name);
        setImg(model.img);
        setCategory(model.category || 'smartphone');

        // Load variants for this model
        const existingVariants = initialVariants
            .filter(v => v.modelId === model.id)
            .map(v => ({ id: v.id, name: v.name, basePrice: v.basePrice }));
        setFormVariants(existingVariants);

        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setBrandId(brands[0]?.id || '');
        setName('');
        setImg('');
        if (preselectedCategory) setCategory(preselectedCategory);
        setFormVariants([]);
        setIsDialogOpen(false);
    };

    const addFormVariant = () => {
        setFormVariants([...formVariants, {
            id: `temp-${Math.random()}`,
            name: '',
            basePrice: 0,
            isNew: true
        }]);
    };

    const updateFormVariant = (index: number, field: keyof FormVariant, value: any) => {
        const newVariants = [...formVariants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormVariants(newVariants);
    };

    const removeFormVariant = (index: number) => {
        const newVariants = [...formVariants];
        if (newVariants[index].isNew) {
            // Just remove from array
            newVariants.splice(index, 1);
        } else {
            // Mark for deletion
            newVariants[index].isDeleted = true;
        }
        setFormVariants(newVariants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandId || !name || !img) return;

        setIsLoading(true);
        try {
            let targetModelId = editingId;

            if (editingId) {
                await updateModel(editingId, brandId, name, img, category);
            } else {
                const res = await addModel(brandId, name, img, category);
                // Note: updated addModel to return { success: true, id: string }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                targetModelId = (res as any).id;
            }

            if (targetModelId) {
                // Handle Variants
                // 1. Process deletions
                const toDelete = formVariants.filter(v => v.isDeleted && !v.isNew);
                for (const v of toDelete) {
                    await deleteVariant(v.id);
                }

                // 2. Process updates and creates
                const activeVariants = formVariants.filter(v => !v.isDeleted);
                for (const v of activeVariants) {
                    if (v.isNew) {
                        await addVariant(targetModelId, v.name, Number(v.basePrice));
                    } else {
                        // Only update if changed? For now update all to be safe/simple
                        await updateVariant(v.id, targetModelId, v.name, Number(v.basePrice));
                    }
                }
            }

            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save. Check console.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return alert('Max 2MB');
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const url = await uploadImage(formData);
            setImg(url);
        } catch { alert('Upload failed'); } finally { setIsUploading(false); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-3 pr-8 py-2 border rounded-full bg-background text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                    )}
                </div>
                <button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md font-medium text-sm whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Model</span>
                </button>
            </div>

            <div className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={visibleModels.map(m => m.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visibleModels.map((model) => (
                                <SortableModel
                                    key={model.id}
                                    model={model}
                                    brands={brands}
                                    variants={initialVariants}
                                    onEdit={handleEdit}
                                    onDelete={async (id) => { if (confirm('Are you sure?')) { await deleteModel(id); router.refresh(); } }}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                {visibleModels.length === 0 && <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">No models found</div>}
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30 shrink-0">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Model & Pricing' : `Add New Model`}</h3>
                            <button onClick={resetForm} className="p-2 hover:bg-muted rounded-full text-muted-foreground"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1">
                            <form id="model-form" onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                    {/* Left: Basic Info */}
                                    <div className="md:col-span-4 space-y-6 border-r md:pr-8">
                                        <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Model Details</h4>

                                        {!preselectedCategory && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Device Type</label>
                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full p-2.5 border rounded-lg bg-background"
                                                >
                                                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Brand</label>
                                            <select
                                                value={brandId}
                                                onChange={(e) => setBrandId(e.target.value)}
                                                className="w-full p-2.5 border rounded-lg bg-background"
                                            >
                                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Model Name</label>
                                            <input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full p-2.5 border rounded-lg bg-background"
                                                placeholder="e.g. iPhone 15 Pro"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <label className="text-sm font-medium">Image</label>
                                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 bg-muted/10 min-h-[140px]">
                                                {img ? (
                                                    <div className="relative w-full aspect-square max-w-[120px] rounded-lg overflow-hidden border">
                                                        <Image src={img} alt="Preview" fill className="object-cover" />
                                                        <button type="button" onClick={() => setImg('')} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-muted-foreground"><Upload className="w-6 h-6 mx-auto mb-2 opacity-50" /><span className="text-xs">Select Image</span></div>
                                                )}
                                                <div className="flex gap-2 mt-4 w-full">
                                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex-1 py-1.5 bg-muted hover:bg-muted/80 rounded border text-xs">{isUploading ? 'Uploading...' : 'Choose File'}</button>
                                                </div>
                                                <input value={img} onChange={(e) => setImg(e.target.value)} className="w-full mt-2 p-1.5 border rounded text-xs" placeholder="Or Image URL" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Variants */}
                                    <div className="md:col-span-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Pricing & Variants</h4>
                                            <button
                                                type="button"
                                                onClick={addFormVariant}
                                                className="text-xs flex items-center gap-1 text-primary hover:underline font-medium"
                                            >
                                                <Plus className="w-3 h-3" /> Add Variant
                                            </button>
                                        </div>

                                        <div className="space-y-3 bg-muted/10 p-4 rounded-xl border min-h-[300px]">
                                            <div className="grid grid-cols-12 gap-4 px-2 pb-2 text-xs font-medium text-muted-foreground border-b mb-2">
                                                <div className="col-span-5">Variant Name (Storage/Spec)</div>
                                                <div className="col-span-5">Base Price (₹)</div>
                                                <div className="col-span-2 text-right">Actions</div>
                                            </div>

                                            {formVariants.filter(v => !v.isDeleted).map((variant, idx) => (
                                                <div key={variant.id || idx} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-left-2 duration-200">
                                                    <div className="col-span-5">
                                                        <input
                                                            value={variant.name}
                                                            onChange={(e) => updateFormVariant(idx, 'name', e.target.value)}
                                                            className="w-full p-2 border rounded-md bg-background text-sm"
                                                            placeholder="e.g. 128GB / 8GB RAM"
                                                        />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <input
                                                            type="number"
                                                            value={variant.basePrice}
                                                            onChange={(e) => updateFormVariant(idx, 'basePrice', e.target.value)}
                                                            className="w-full p-2 border rounded-md bg-background text-sm"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="col-span-2 flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFormVariant(idx)}
                                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {formVariants.filter(v => !v.isDeleted).length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <p className="text-sm">No variants added yet.</p>
                                                    <button type="button" onClick={addFormVariant} className="text-primary hover:underline text-sm mt-2">Add your first variant</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t bg-muted/10 shrink-0">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="model-form"
                                disabled={isLoading || isUploading}
                                className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingId ? 'Save Changes' : 'Create Model'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
