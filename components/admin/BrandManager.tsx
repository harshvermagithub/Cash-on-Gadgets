
'use client';

import { useState, useRef } from 'react';
import { addBrand, deleteBrand } from '@/actions/admin';
import { uploadImage } from '@/actions/upload';
import { Trash2, Plus, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Brand {
    id: string;
    name: string;
    logo: string;
}

export default function BrandManager({ initialBrands }: { initialBrands: Brand[] }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !logo) return;

        setIsLoading(true);
        try {
            await addBrand(name, logo);
            setName('');
            setLogo('');
            router.refresh();
        } catch (error) {
            alert('Failed to add brand');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete associated models too.')) return;
        try {
            await deleteBrand(id);
            router.refresh();
        } catch (error) {
            alert('Failed to delete brand');
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
            setLogo(url);
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
                <h3 className="text-lg font-bold mb-4">Add New Brand</h3>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Brand Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="e.g. Nokia"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Logo URL (SVG/PNG)</label>
                        <div className="flex gap-2">
                            <input
                                value={logo}
                                onChange={(e) => setLogo(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-background"
                                placeholder="URL or Upload"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/svg+xml"
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
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 h-[42px]"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Plus className="w-5 h-5" />}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialBrands.map((brand) => (
                    <div key={brand.id} className="p-4 border rounded-xl flex items-center justify-between bg-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative bg-gray-50 rounded-lg p-2">
                                <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                            </div>
                            <span className="font-bold">{brand.name}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(brand.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
