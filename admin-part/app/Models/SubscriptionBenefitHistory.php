<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionBenefitHistory extends Model
{
    use HasFactory;
    protected $fillable = [
        'cus_sub_id','order_id', 'service_id', 'category_id','product_id','qty','status'
    ];
}