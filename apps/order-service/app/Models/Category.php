<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'status',
        'image',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'meta_image',
        'meta_data',
    ];

    // A category has many products
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
