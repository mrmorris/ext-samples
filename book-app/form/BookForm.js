Ext.ns("App.form");

App.form.BookForm = Ext.extend(App.form.FormPanelBaseCls, {
    border        : false,
    autoScroll    : true,
    frame         : false,
    layout        : 'form',
    labelWidth    : 60,
    defaultType   : 'textfield',
    defaults      : {
        width      : 200,
        maxLength  : 255,
        allowBLank : false
    },
    //private
    //constructs the form layout elements.
    initComponent : function() {
        Ext.applyIf(this, {
            bbar  : this.buildBbar(),
            items : this.buildFormItems()
        });

        App.form.BookForm.superclass.initComponent.call(this);

        this.addEvents({
            /**
             * @event newemp
             * Fired after the new employee button is pressed
             *
             */
            newemp    : true,
            saveemp   : true,
            delemp    : true
        });

        if (this.record) {
            this.on({
                scope  : this,
                render : {
                    single : true,
                    fn     : this.loadFormAfterRender
                }
            });
        }
    },

    buildBbar : function() {
        return [
            {
                text    : 'Save',
                iconCls : 'icon-disk',
                scope   : this,
                handler : this.onSave
            },
            '->',
            {
                text    : 'Reset',
                iconCls : 'icon-arrow_undo',
                scope   : this,
                handler : this.onReset
            }           
        ];
    },
    buildFormItems : function() {
        var basicDetails            = this.buildBasicDetails(),
            advancedDetails         = this.buildAdvancedDetails();

        return [            
            {
                xtype: 'tabpanel',
                activeTab: 0,
                height:300,
                width: '100%',
                items: [
                    basicDetails,
                    advancedDetails
                ]
            }
            
        ];
    },

    buildBasicDetails : function() {
        return {
            title: 'Basic Details',
            xtype          : 'container',
            layout         : 'fit',
            anchor         : '-10',
            defaultType    : 'container',
            defaults       : {
                width      : 150,
                labelWidth : 40,
                layout     : 'form'
            },
            items          : [
                {
                    xtype : 'hidden',
                    name  : 'id'
                },
                {
                    labelWidth : 40,
                    items      :  {
                        xtype      : 'textfield',
                        fieldLabel : 'Title',
                        name       : 'title',
                        anchor     : '-10',
                        allowBlank : false,
                        maxLength  : 100
                    }
                },
                {
                    items      :  {
                        xtype      : 'textfield',
                        fieldLabel : 'Author',
                        name       : 'author',
                        anchor     : '-10',
                        maxLength  : 100
                    }
                },
                {
                    labelWidth : 30,
                    items      :  {
                        xtype      : 'numberfield',
                        fieldLabel : 'Pages',
                        name       : 'pages',
                        anchor     : '-10',
                        allowBlank : false,
                        maxLength  : 50
                    }
                }
            ]
        };
    },
    buildAdvancedDetails : function() {
        return {
            title: 'Advanced Details',
            xtype       : 'container',
            layout      : 'fit',
            anchor      : '-10',
            defaultType : 'container',
            defaults    : {
                width  : 200,
                layout : 'form'
            },
            items       : [
                {
                    labelWidth : 40,
                    width      : 175,
                    items      :  {
                        xtype      : 'datefield',
                        fieldLabel : 'Hired',
                        anchor     : '-10',
                        name       : 'dateHired'
                    }
                },
                {
                    labelWidth : 50,
                    width      : 145,
                    items      :  {
                        xtype            : 'numberfield',
                        fieldLabel       : 'Rate/hr',
                        name             : 'rate',
                        allowDecimals    : true,
                        anchor           : '-10',
                        decimalPrecision : 2
                    }
                },
                {
                    labelWidth : 40,
                    width      : 325,
                    items      : {
                        xtype      : 'textfield',
                        fieldLabel : 'Email',
                        name       : 'email',
                        anchor     : '-10',
                        maxLength  : 50
                    }
                },
                {
                    width      : 140,
                    labelWidth : 30,
                    items      : {
                        xtype      : 'datefield',
                        fieldLabel : 'DOB',
                        name       : 'dob',
                        allowBlank : true,
                        anchor     : '-10'
                    }
                }

            ]
        };
    },

    onNew : function() {
        this.clearForm();
        this.fireEvent('newemp', this);
    },
    onSave : function() {

        var form = this.getForm();

        if (form.isValid()) {

            Ext.getBody().mask("Submitting", 'x-mask-loading');

            form.submit({
                url     : 'book-app/data/data-add-book-success.json',
                scope   : this,
                success : this.onFormSaveSuccess,
                failure : this.onFormSaveFailure
            });
        
        }
    },
    onReset : function() {
        this.reset();
    },
    onDelete : function() {
        var vals = this.getValues();
        if (vals.id.length > 0) {
            this.fireEvent('delemp', this, vals);
        }
    },
    onFormSaveFailure: function() {

    },
    onFormSaveSuccess: function(form, action) {

        var record = Ext.getCmp('main-grid').getSelectionModel().getSelected();
        var vals = form.getValues();

        var msg = String.format(
            "Added {0} by {1}",
            vals.title,
            vals.author
        );

        var mainGrid = Ext.getCmp('main-grid');

        if (record) {

            // update

            record.set('title', vals.title);
            record.set('author', vals.author);
            record.commit();

        } else {

            // add

            var resultData = action.result.data;

            // get a record constructor from the store 
            var record = new mainGrid.store.recordType(resultData);

            mainGrid.store.add(record);

        }

        Ext.getCmp('main-form').getForm().reset();

        mainGrid.bookFormWindow.hide();

        Ext.getBody().unmask();

        Ext.MessageBox.alert('Success', msg);

    }
});

Ext.reg('bookform', App.form.BookForm);

