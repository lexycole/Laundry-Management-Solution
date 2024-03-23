<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerSubscription extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_id', 'sub_id', 'start_date','end_date','created_at','updated_at'
    ];
}