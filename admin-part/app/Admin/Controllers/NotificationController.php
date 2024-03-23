<?php

namespace App\Admin\Controllers;

use App\Models\Notification;
use App\Models\Customer;
use App\Models\Status;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class NotificationController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Notifications';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Notification());

        $grid->column('id', __('Id'));
        $grid->column('customer_id', __('Customer'))->display(function($customer){
            $customer_name = Customer::where('id',$customer)->value('customer_name');
            if ($customer == 0) {
                return "For All";
            } else {
                return "$customer_name";
            }
        });
         $grid->column('notification_type', __('Notification Type'))->display(function($notification){
            $notification = Status::where('id',$notification)->value('status_name');
            if ($notification == 1) {
                return "Order Notifications";
            } else {
                return "Announcements";
            }
        });
        $grid->column('message', __('Message'));
        $grid->column('status', __('Status'))->display(function($status){
            $status_name = Status::where('id',$status)->value('status_name');
            if ($status == 1) {
                return "<span class='label label-success'>$status_name</span>";
            } else {
                return "<span class='label label-danger'>$status_name</span>";
            }
        });
        $grid->disableExport();
        //$grid->disableCreateButton();
        $grid->actions(function ($actions) {
        $actions->disableView();
        $actions->disableDelete();
        });
        $grid->filter(function ($filter) {
            $statuses = Status::pluck('status_name', 'id');
            $customers = Customer::where('status',1)->pluck('customer_name','id');
            
            $filter->disableIdFilter();
            $filter->like('customer_id', 'Customer id')->select($customers);        
            $filter->equal('status', 'Status')->select($statuses);
        
        });

        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(Notification::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('customer_id', __('Customer id'));
        $show->field('title', __('Title'));
        $show->field('description', __('Description'));
        $show->field('status', __('Status'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new Notification());
        $customers = Customer::where('status',1)->pluck('customer_name','id');
        $statuses = Status::pluck('status_name', 'id');

        $form->select('customer_id', __('Customer'))->options($customers);
        $form->select('notification_type', __('Notification Type'))->options(['1' => 'Order Notifications', '2'=> 'Announcements']);
        $form->textarea('message', __('Message'))->rules('required');
        $form->textarea('message_ar', __('Message in Arabic'));
        $form->select('status', __('Status'))->options($statuses)->rules('required');
        
        $form->footer(function ($footer) {
        $footer->disableViewCheck();
        $footer->disableEditingCheck();
        $footer->disableCreatingCheck();
        });
        
        $form->saving(function ($form) {
            if($form->customer_id == "")
            {
                $form->customer_id = 0;
            }
        });

        $form->tools(function (Form\Tools $tools) {
        $tools->disableDelete(); 
        $tools->disableView();
        });

        return $form;
    }
}
