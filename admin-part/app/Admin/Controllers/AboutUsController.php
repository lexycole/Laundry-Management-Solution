<?php

namespace App\Admin\Controllers;

use App\Models\AboutUs;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class AboutUsController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'About Us';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new AboutUs);

        $grid->column('id', __('Id'));
        $grid->column('image', __('Image'))->image();
        $grid->column('description', __('Description'));
        $grid->disableExport();
        $grid->disableCreation();
        $grid->disableFilter();
        $grid->actions(function ($actions) {
            $actions->disableView();
            $actions->disableDelete();
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
        $form = new Form(new AboutUs);

        $form->image('image', __('Image'))->rules('required')->uniqueName();
        $form->textarea('description', __('Description'))->rules(function ($form) {
            return 'required';
        });
        $form->textarea('description_ar', __('Description Arabic'));
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
