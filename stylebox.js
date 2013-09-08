/**
 * Style list
 */
StyleList = new Meteor.Collection("styleList");


if (Meteor.isClient) {

    Session.setDefault( 'stage', 'index' );

    Template.Main.events = {
        'click a': function( e ){
            var a = $(e.target);

            if(a.attr( 'href').indexOf( '/') == 0 ){
                e.preventDefault();
                Router.navigate( a.attr( 'href'), true );
            }
        }
    };

    Template.Main.stage = function(){

        if( !Meteor.user() && Session.get( 'stage' ) == 'user' ){
            Router.navigate( 'index', true );
        }

        return Session.get( 'stage' );
    };

    Template.Main.helpers({
        equals: function( a, b){
            return a == b;
        }
    });

    Template.StyleList.list = function () {
        return StyleList.find({});
    };

    Template.UserStyleList.list = function () {
        return StyleList.find({ userId: Meteor.userId() });
    };

    Template.UserStyleList.events = {
        'click .J_Delete': function( e ){
            var btn = $( e.target );
            var id = btn.attr( 'data-id' );
            if( id && confirm( '确认删除该模块么？' ) ){
                StyleList.remove({ _id: id });
            }
        }
    };

    Template.NewStyleBox.events = {
        'submit .J_Form': function( e, t ){
            e.preventDefault();

            var form = e.target;

            var formDataArray = $(form).serializeArray();
            var formData = {};

            $.each( formDataArray, function( index ,obj ){
                var value = obj.value;
                var key = obj.name;

                if( key in formData ){
                    if( value != formData[ key ] ){
                        if( !$.isArray( formData[ key ] ) ){
                            formData[ key ] = [ formData[ key ] ];
                        }
                        formData[ key ].push( value );
                    }
                }
                else {
                    formData[ key ] = value;
                }
            });

            // 处理jsfiddle的地址
            formData.slug = /(?:jsfiddle\.net\/)(.+)\/?/.exec( formData.jsfiddle );

            if( formData.slug && ( formData.slug = formData.slug[1] ) ){

                if( formData.slug[ formData.slug.length - 1 ] == '\/' ){
                    formData.slug = formData.slug.substring( 0, formData.slug.length - 1);
                }

                // 插入用户id
                formData.userId = Meteor.userId();

                StyleList.insert( formData );
                form.reset();

                $( t.findAll( '.J_NewStyleBoxModal' )).modal( 'hide' );
            }
            else {
                alert( '您输入的Jsfiddle地址有误' );
            }
        }
    };


    ////////// Tracking selected list in URL //////////

    var StyleBoxRouter = Backbone.Router.extend({
        routes: {
            ':pageType': 'main'
        },

        main: function( page ){
            Session.set( 'stage', page );
        }
    });

    Router = new StyleBoxRouter;

    Meteor.startup(function () {
        Backbone.history.start({pushState: true});
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
