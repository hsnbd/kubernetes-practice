<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'short_description',
        'price',
        'image',
        'status',
        'type',
        'brand',
        'sku',
        'slug',
        'stock',
        'weight',
        'height',
        'width',
        'length',
        'tax',
        'shipping',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'meta_image',
        'meta_data',
        'owner_id',
        'category_id',
    ];

    // A product belongs to one user (owner)
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // A product belongs to one category
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'product_tag', 'product_id', 'tag_id')->withTimestamps();
    }
}
