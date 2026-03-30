<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_key',
        'page_type',
        'section_name',
        'title',
        'sort_order',
        'brand_id',
        'content',
        'meta_title',
        'meta_description',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the brand associated with this page content
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the user who created this content
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this content
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope to get only landing pages
     */
    public function scopeLanding($query)
    {
        return $query->where('page_type', 'landing');
    }

    /**
     * Scope to get only brand pages
     */
    public function scopeBrand($query)
    {
        return $query->where('page_type', 'brand');
    }

    /**
     * Scope to get only active pages
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Scope to get sections for a specific page
     */
    public function scopeForPage($query, $pageKey)
    {
        return $query->where('page_key', $pageKey);
    }
}
