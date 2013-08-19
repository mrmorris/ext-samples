Ext.ns('App.grid');

App.grid.BookGridPanel = Ext.extend(Ext.grid.GridPanel, {
    url           : 'data-books.json',
    viewConfig    : { 
        forceFit : true 
    },
    columns       : [
        {
            header    : 'Title',
            dataIndex : 'title',
            sortable  : true
        },
        {
            header    : 'Author',
            dataIndex : 'author',
            sortable  : true
        },
        {
            header    : 'Pages',
            dataIndex : 'pages',
            sortable  : true
        }
    ],
    initComponent : function() {

        this.store = this.buildStore();

        this.listeners = {
            rowdblclick: this.onRowDblClick,
            rowcontextmenu: this.onRowCtxMenu,
            destroy: function(thisGrid) {
               // always passes the component being destroyed
               if (thisGrid.rowCtxMenu) {
                  thisGrid.rowCtxMenu.destroy();
               }
            }        
        };

        this.tbar = this.buildToolbar();

        this.bbar = {
            xtype       : 'paging',
            store       : this.store,
            pageSize    : 20, 
            displayInfo : true
        };

        App.grid.BookGridPanel.superclass.initComponent.call(this);

    },
    
    buildStore : function() {
        return  {
            xtype    : 'jsonstore',
            url      : this.url,
            autoLoad : true,
            root: 'data',
            idProperty: 'id',
            totalProperty : 'total', 
            fields   : [
                'id', 
                'title', 
                'author', 
                'pages'
            ],
            sortInfo : {
                field : 'title',
                dir   : 'ASC'
            }
        };
    },

    buildToolbar: function() {
        return {
            items: [
                {
                    text: 'Add',
                    iconCls: 'icon-add',
                    handler: this.loadForm,
                    scope: this
                },
                '-',
                {
                    text: 'Search',
                    iconCls: 'icon-magnifier',
                    handler: this.loadSearch,
                    scope: this
                },
            ]
        };
    },

    loadForm: function(btn, eventObj) {
        
        console.log("Loading form on", this);

        if (!this.bookFormWindow) {

            this.bookFormWindow = new Ext.Window({
                animateTarget: btn ? btn.el : null,                
                closeAction: 'hide',
                id: 'bookFormWindow',
                height: 400,
                width: 500,
                constrain: true,
                items: [
                    {
                        xtype: 'bookform',
                        id: 'main-form'
                    }
                ]
            });

        }

        this.bookFormWindow.show();

    },

    loadSearch: function(btn, eventObj) {
        console.log(arguments);
    },

    add : function(rec) {
        var store = this.store;
        var sortInfo = store.sortInfo;
        
        if (Ext.isArray(rec)) {
            Ext.each(rec, function(rObj, ind) {
                if (! (rObj instanceof Ext.data.Record)) {
                    rec[ind] = new this.store.recordType(rObj);
                }
            });
        }
        else if (Ext.isObject(rec) && ! (rec instanceof Ext.data.Record)) {
            rec = new this.store.recordType(rec);
        }

        store.add(rec);
        store.sort(sortInfo.field, sortInfo.direction);
    },
    loadData : function(d) {
        return this.store.loadData(d);
    },
    load : function(o) {
        return this.store.load(o);
    },
    removeAll : function() {
        return this.store.removeAll();
    }, 
    remove    : function(r) {
        return this.store.remove(r);
    },
    getSelected : function() {
        return this.selModel.getSelections();
    },
    onRowDblClick: function(thisGrid, rowIndex)  {

        thisGrid.getSelectionModel().selectRow(rowIndex);

        // initialize edit form

        this.loadForm();

        // set data on the form
        Ext.getCmp('main-form').getForm().loadRecord(thisGrid.store.getAt(rowIndex));

    },
    onRowCtxMenu: function(thisGrid, rowIndex, evtObj) {

        evtObj.stopEvent();

        // another means of getting the SelectionModel
        // and in this case we are selecting a row at the index that was clicked
        thisGrid.getSelectionModel().selectRow(rowIndex);

        // this is a technique to avoid re-instantiating objects more than once
        if (!thisGrid.rowCtxMenu) {

            thisGrid.rowCtxMenu = new Ext.menu.Menu({
               items : [
                   {
                        text    : 'View Record',
                        iconCls: 'icon-magnifier',
                        handler : function() {
                            console.log("Initiate Edit form");
                        } 
                   },
                   {
                        text: 'Delete Book',
                        iconCls: 'icon-erase',
                        handler: function() {
                            console.log("Remove book");
                        }
                   }
                ]
            });

        }

        thisGrid.rowCtxMenu.showAt(evtObj.getXY());

    }
});

Ext.reg('bookgridpanel', App.grid.BookGridPanel)