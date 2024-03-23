<?php

namespace App\Admin\Controllers;
use App\Models\Status;
use App\Models\Subscription;
use App\Models\Customer;
use App\Models\CustomerSubscription;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class CustomerSubscriptionController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Customer Subscriptions';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new CustomerSubscription);

        $grid->column('id', __('Id'));
        $grid->column('customer_id', __('Customer'))->display(function($customer_id){
            return Customer::where('id',$customer_id)->value('customer_name');
        });
        $grid->column('sub_id', __('Subscription id'))->display(function($sub_id){
            return Subscription::where('id',$sub_id)->value('sub_name');
        });
        $grid->column('start_date', __('Start Date'));
        $grid->column('end_date', __('End Date'));
        $grid->disableExport();
        $grid->disableActions();
        $grid->disableCreateButton();
        
        $grid->filter(function ($filter) {
            $subscriptions = Subscription::pluck('sub_name', 'id');
            $customers = Customer::pluck('customer_name', 'id');
            $filter->equal('sub_id', 'Subscription')->select($subscriptions);
            $filter->equal('customer_id', 'Customer')->select($customers);
        });
        return $grid;
    }
}
