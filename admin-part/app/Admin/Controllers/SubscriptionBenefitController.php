<?php

namespace App\Admin\Controllers;
use App\Models\Service;
use App\Models\Category;
use App\Models\Product;
use App\Models\Status;
use App\Models\SubscriptionBenefit;
use App\Models\Subscription;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class SubscriptionBenefitController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Subscription Benefits';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new SubscriptionBenefit);

        $grid->column('id', __('Id'));
        $grid->column('sub_id', __('Subscription id'))->display(function($sub_id){
            return Subscription::where('id',$sub_id)->value('sub_name');
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
        $grid->disableExport();
        $grid->actions(function ($actions) {
            $actions->disableView();
        });

        $grid->filter(function ($filter) {
            $subscriptions = Subscription::pluck('sub_name', 'id');
            $services = Service::pluck('service_name', 'id');
            $categories = Category::pluck('category_name', 'id');
            $products = Product::pluck('product_name', 'id');
            $filter->equal('sub_id', 'Subscription')->select($subscriptions);
            $filter->equal('service_id', 'Service')->select($services);
            $filter->equal('category_id', 'Category')->select($categories);
            $filter->equal('product_id', 'Product')->select($products);
        });
        return $grid;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new SubscriptionBenefit);
        
        $services = Service::pluck('service_name', 'id');
        $subscriptions = Subscription::pluck('sub_name', 'id');
        $categories = Category::pluck('category_name', 'id');
        $form->select('sub_id', __('Subscription'))->options($subscriptions)->rules(function ($form) {
            return 'required';
        });
        $form->select('service_id', __('Service'))->options($services)->rules(function ($form) {
            return 'required';
        });
        $form->select('category_id', __('Category'))->options($categories)->load('product_id', '/admin/get_products', 'id', 'product_name')->rules(function ($form) {
            return 'required';
        });
        $form->select('product_id', "Product")->options(function ($id) {
            $product = Product::find($id);

            if ($product) {
                return [$product->id => $product->product_name];
            }
        })->rules(function ($form) {
            return 'required';
        });
        $form->decimal('qty', __('Qty'))->rules(function ($form) {
            return 'required|integer|min:0';
        });
        
        $form->tools(function (Form\Tools $tools) {
            $tools->disableDelete(); 
            $tools->disableView();
        });
        $form->footer(function ($footer) {
            $footer->disableViewCheck();
            $footer->disableEditingCheck();
            $footer->disableCreatingCheck();
        });
        return $form;
    }
}
