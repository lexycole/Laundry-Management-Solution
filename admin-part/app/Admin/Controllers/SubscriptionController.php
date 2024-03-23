<?php

namespace App\Admin\Controllers;

use App\Models\Status;
use App\Models\Subscription;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class SubscriptionController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Subscriptions';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Subscription);

        $grid->column('id', __('Id'));
        $grid->column('sub_name', __('Subscription Name'));
        $grid->column('sub_image', __('Subscription Image'))->image();
        $grid->column('sub_description', __('Subscription Description'));
        $grid->column('sub_fee', __('Subscription Fee'));
        $grid->column('no_of_bookings', __('Number Of Bookings'));
        $grid->column('validity', __('Validity'));
        $grid->column('validity_label', __('Validity Label'));
        $grid->column('status', __('Status'))->display(function($status){
            $status_name = Status::where('id',$status)->value('status_name');
            if ($status == 1) {
                return "<span class='label label-success'>$status_name</span>";
            } else {
                return "<span class='label label-danger'>$status_name</span>";
            }
        });
        $grid->disableExport();
        $grid->actions(function ($actions) {
            $actions->disableView();
        });
        $grid->filter(function ($filter) {
            //Get All status
            $statuses = Status::pluck('status_name', 'id');
            
            $filter->like('sub_name', 'Subscription Name');
            $filter->equal('status', 'Status')->select($statuses);
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
        $form = new Form(new Subscription);
        $statuses = Status::pluck('status_name', 'id');
        $form->text('sub_name', __('Subscription Name'))->rules(function ($form) {
            return 'required|max:250';
        });
        $form->image('sub_image', __('Subscription Image'))->move('subscriptions')->uniqueName()->rules('required');
        $form->textarea('sub_description', __('Subscription Description'))->rules(function ($form) {
            return 'required';
        });
        $form->number('sub_fee', __('Subscription Fee'))->rules(function ($form) {
            return 'required';
        });
        $form->decimal('no_of_bookings', __('No Of Bookings'));
        $form->decimal('validity', __('Validity'));
        $form->text('validity_label', __('Validity Label'))->rules(function ($form) {
            return 'required';
        });
        $form->select('status', __('Status'))->options($statuses)->default(1)->rules(function ($form) {
            return 'required';
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
