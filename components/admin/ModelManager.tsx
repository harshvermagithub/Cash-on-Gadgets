'use client';

import { useState, useRef, useEffect } from 'react';
import { addModel, updateModel, deleteModel, reorderModels } from '@/actions/admin';
import { uploadImage } from '@/actions/upload';
import { Trash2, Plus, Loader2, Upload, Pencil, X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
function SortableModel({ model, brands, onEdit, onDelete }: { model: Model, brands: Brand[], onEdit: (m: Model) => void, onDelete: (id: string) => void }) {
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

    return (
        <div ref={setNodeRef} style={style} className="p-4 border rounded-xl flex items-center justify-between bg-card touch-none relative group transition-shadow hover:shadow-md">

            <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                {/* Drag Handle - Visible and explicitly usable */}
                <div {...attributes} {...listeners} className="p-2 -ml-2 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing pointer-events-auto">
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="w-12 h-12 relative bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                    {model.img && (model.img.startsWith('/') || model.img.startsWith('http')) ? (
                        <Image src={model.img} alt={model.name} fill className="object-cover" />
                    ) : (
                        <span className="text-xl font-bold text-gray-400">{model.name[0]}</span>
                    )}
                </div>
                {/* ...Rest of Content */}
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold">{model.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">{model.category || 'smartphone'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{brands.find(b => b.id === model.brandId)?.name}</p>
                </div>
            </div>

            <div className="flex gap-2 relative z-20">
                <button
                    onClick={() => onEdit(model)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors bg-card border"
                    title="Edit"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(model.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors bg-card border"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function ModelManager({ initialModels, brands, preselectedCategory }: { initialModels: Model[], brands: Brand[], preselectedCategory?: string }) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [brandId, setBrandId] = useState(brands[0]?.id || '');
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [category, setCategory] = useState(preselectedCategory || 'smartphone');

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [filterBrand, setFilterBrand] = useState('all');
    const [filterCategory, setFilterCategory] = useState(preselectedCategory || 'smartphone');
    const [searchQuery, setSearchQuery] = useState('');

    // Local state for sorting
    const [models, setModels] = useState(initialModels);

    useEffect(() => {
        // Sync with props if search/filter changes significantly or new props arrive
        // But preserve local sort order if just editing details?
        // Simple approach: Always respect DB load order unless we dragging
        // We need to resort models based on prop update
        const sorted = [...initialModels].sort((a, b) => (a.priority || 100) - (b.priority || 100));
        setModels(sorted);
    }, [initialModels]);

    const visibleModels = models.filter(m => {
        const matchesBrand = filterBrand === 'all' || m.brandId === filterBrand;
        const matchesCategory = (m.category || 'smartphone') === filterCategory;
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBrand && matchesCategory && matchesSearch;
    });

    const isFiltered = filterBrand !== 'all' || searchQuery !== '';

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5 // Drag only starts after moving 5px
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setModels((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Calculate new priorities based on index
                const updates = newItems.map((model, index) => ({
                    id: model.id,
                    priority: index + 1
                }));

                // Fire and forget server action (optimistic UI)
                reorderModels(updates).then(() => {
                    // Optional: refresh to confirm
                    // router.refresh();
                });

                return newItems;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandId || !name || !img) return;

        setIsLoading(true);
        try {
            if (editingId) {
                await updateModel(editingId, brandId, name, img, category);
            } else {
                await addModel(brandId, name, img, category);
            }
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(editingId ? 'Failed to update model' : 'Failed to save model');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (model: Model) => {
        setEditingId(model.id);
        setBrandId(model.brandId);
        setName(model.name);
        setImg(model.img);
        setCategory(model.category || 'smartphone');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setBrandId(brands[0]?.id || '');
        setName('');
        setImg('');
        if (preselectedCategory) setCategory(preselectedCategory);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteModel(id);
            router.refresh();
        } catch {
            alert('Failed to delete model');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('File size too large. Max 2MB.');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const url = await uploadImage(formData);
            setImg(url);
        } catch (error) {
            alert('Failed to upload image');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Category Tabs - Only show if no preselected category */}
            {!preselectedCategory && (
                <div className="flex flex-wrap gap-2 pb-4 border-b">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setFilterCategory(cat.id);
                                setCategory(cat.id);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filterCategory === cat.id
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="bg-card border rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">
                        {editingId ? 'Edit Model' : `Add ${CATEGORIES.find(c => c.id === category)?.label} Model`}
                    </h3>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-red-500 flex items-center gap-1 hover:underline">
                            <X className="w-4 h-4" /> Cancel Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {!preselectedCategory && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Device Type</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-background"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Brand</label>
                        <select
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-background"
                        >
                            {brands.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Model Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="e.g. iPhone 15"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                value={img}
                                onChange={(e) => setImg(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-background text-xs"
                                placeholder="URL"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="p-2 border rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                                title="Upload"
                            >
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        disabled={isLoading || isUploading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex justify-center h-[42px] items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (editingId ? 'Update' : <Plus className="w-5 h-5" />)}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">{CATEGORIES.find(c => c.id === filterCategory)?.label} Models</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                placeholder="Search model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-3 pr-8 py-2 border rounded-lg bg-background text-sm w-48 md:w-64"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterBrand('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterBrand === 'all'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted'
                            }`}
                    >
                        All
                    </button>
                    {brands.map(b => (
                        <button
                            key={b.id}
                            onClick={() => setFilterBrand(b.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterBrand === b.id
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background hover:bg-muted'
                                }`}
                        >
                            {b.name}
                        </button>
                    ))}
                </div>

                {/* Drag and Drop is now always enabled, even when filtered */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={visibleModels.map(m => m.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visibleModels.map((model) => (
                                <SortableModel
                                    key={model.id}
                                    model={model}
                                    brands={brands}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {visibleModels.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No models found.
                    </div>
                )}
            </div>
        </div>
    );
}
