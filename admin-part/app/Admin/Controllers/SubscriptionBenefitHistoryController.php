<?php

namespace App\Admin\Controllers;
use App\Models\Service;
use App\Models\Category;
use App\Models\Product;
use App\Models\SubscriptionBenefitHistory;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class SubscriptionBenefitHistoryController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Subscription Benefit Histories';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new SubscriptionBenefitHistory);

        $grid->column('id', __('Id'));
        $grid->column('cus_sub_id', __('Customer Subscription Id'))->display(function($cus_sub_id){
            return '#'.$cus_sub_id;
        });
        $grid->column('service_id', __('Service id'))->display(function($service){
            return Service::where('id',$service)->value('service_name');
        });
        $grid->column('category_id', __('Category'))->display(function($category){
            return Category::where('id',$category)->value('category_name');
        });
        $grid->column('product_id', __('Product id'))->display(function($product){
            return Product::where('id',$product)->value('product_name');
        });
        $grid->column('qty', __('Qty'));
        $grid->column('status', __('Status'))->display(function($status){
            if($status == 1){
                return "Initiated";
            }else if($status == 2){
                return "Completed";
            }else if($status == 3){
                return "Expired";
            }
        });
        $grid->disableExport();
        $grid->disableActions();
        $grid->disableCreateButton();

        $grid->filter(function ($filter) {
            $services = Service::pluck('service_name', 'id');
            $categories = Category::pluck('category_name', 'id');
            $statuses = [1 => 'Initiated', 2 => 'Completed', 3 => 'Expired'];
            $products = Product::pluck('product_name', 'id');
            $filter->equal('service_id', 'Service')->select($services);
            $filter->equal('category_id', 'Category')->select($categories);
            $filter->equal('product_id', 'Product')->select($products);
            $filter->equal('status', 'Status')->select($statuses);
        });
        return $grid;
    }

}
