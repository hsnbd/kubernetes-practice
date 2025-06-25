<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'description', 'status', 'image', 'meta_title', 'meta_description', 'meta_keywords', 'meta_image', 'meta_data'];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
