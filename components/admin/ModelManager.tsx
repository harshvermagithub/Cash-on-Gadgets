
'use client';

import { useState, useRef } from 'react';
import { addModel, deleteModel } from '@/actions/admin';
import { uploadImage } from '@/actions/upload';
import { Trash2, Plus, Loader2, Upload } from 'lucide-react';
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
}

export default function ModelManager({ initialModels, brands }: { initialModels: Model[], brands: Brand[] }) {
    const router = useRouter();
    const [brandId, setBrandId] = useState(brands[0]?.id || '');
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter models by selected brand for better view? Or just list all?
    // Listing all might be messy. Let's filter by the selected brand dropdown by default or have a "All" filter.
    const [filterBrand, setFilterBrand] = useState('all');

    const visibleModels = filterBrand === 'all'
        ? initialModels
        : initialModels.filter(m => m.brandId === filterBrand);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandId || !name || !img) return;

        setIsLoading(true);
        try {
            await addModel(brandId, name, img);
            setName('');
            setImg('');
            router.refresh();
        } catch (error) {
            alert('Failed to add model');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteModel(id);
            router.refresh();
        } catch (error) {
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
            <div className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Add New Model</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                                className="w-full p-2 border rounded-lg bg-background"
                                placeholder="URL or Upload"
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
                                className="p-2 border rounded-lg hover:bg-muted transition-colors"
                                title="Upload Image"
                            >
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        disabled={isLoading || isUploading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex justify-center h-[42px] items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Plus className="w-5 h-5" />}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Existing Models</h3>
                    <select
                        value={filterBrand}
                        onChange={(e) => setFilterBrand(e.target.value)}
                        className="p-2 border rounded-lg bg-background"
                    >
                        <option value="all">All Brands</option>
                        {brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleModels.map((model) => (
                        <div key={model.id} className="p-4 border rounded-xl flex items-center justify-between bg-card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 relative bg-gray-50 rounded-lg overflow-hidden">
                                    <Image src={model.img} alt={model.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold">{model.name}</p>
                                    <p className="text-xs text-muted-foreground">{brands.find(b => b.id === model.brandId)?.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(model.id)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {visibleModels.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No models found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
