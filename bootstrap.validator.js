/**
* Bootstrap.validator plugin for JQuery and Bootstrap 3.
* https://github.com/wpic/bootstrap.validator.js
* By Hamed Abdollahpour 2014 - WPIC Co
*/
(function ( $ ) {

    $.fn.validate = function( options ) {

        var settings = $.extend({
            init: function() {},         /* init even */
            success: function() {},      /* sucess even */
            fail: function(invalids) {}  /* Fail even */
            /* join: ' ' */ /* Join array field data with it - If it be empty it will still remain array */
        }, options );

        var validators = {
            'name+family': /^((?![0-9]).+\s.+)/g,
            'name': /^((?![0-9]).+)/g,
            'family': /^((?![0-9]).+)/g,
            'number': /^[0-9]+/g,
            'url': /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/,
            'date': /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
            'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'tel': /^[0-9\-\+]{3,25}$/
        };

        return this.on('submit', function(e) {
            var form = this;
            var invalids = [];

            settings.init.call(form);

            var data = {};
            $('input,textarea,select', this).filter(":visible,[type='hidden']").each(function() {
                var i = $(this);
                if(!i.parent().is(':visible')) {
                    return;
                }
                var name = i.attr('name');
                if(typeof(name) != 'undefined' && (i.is(":not([type='checkbox'],[type='radio'])") || i.is(":checked"))) {
                    var value = i.val();

                    if(typeof(data[name]) != 'undefined') {
                        data[name] = [].concat(data[name]).concat(value);
                    } else {
                        data[name] = value;
                    }
                }
            });

            /* join array if it's required */
            if (typeof(settings.join) != 'undefined') {
                for(var i in data) {
                    if (typeof(data[i]) == "function") {
                        data[i] = data[i].join(settings.join);
                    }
                }
            }

            /** [data-require] is deprecated use requried instead **/
            $("[data-regex],[data-require],[data-required],[required],[data-equals]", form).filter(':visible').each(function() {
                var self = $(this);

                var regex = self.attr('data-regex');
                var required = self.is('[required]') || self.is('[data-required]') /* the rest deprecated */ || self.is('[data-require]');
                var equals = self.attr('data-equals');
                var value = self.val();

                if(self.is("[type='checkbox']") && !self.is(":checked")) value='';

                // replace value with total value
                var name = self.attr('name');
                if(typeof(name) != 'undefined') {
                    value = data[name];
                }

                if(typeof(equals) != 'undefined' && typeof(data[equals]) != 'undefined') {
                    if(value != data[equals]) {
                        invalids.push(this);
                        invalids.push($("[name='" + equals + "']")[0]);
                    }
                }

                /** array is always valid, because for array inputs we just check required **/
                if(!Array.isArray(value)) {
                    if(value && value.length > 0) {
                        // try to use tag name for regex
                        if (typeof(regex) == 'undefined') {
                            var type = $(this).attr('type');
                            if (typeof(type) != 'undefined' && typeof(validators[type.toLowerCase()]) != 'undefined') {
                                regex = type.toLowerCase();
                            }
                        }

                        if (regex) {
                            var r;
                            if (typeof(validators[regex]) != 'undefined') {
                                r = validators[regex]
                            }
                            // Use regex itself
                            else {
                                r = new RegExp(regex);
                            }

                            if(!r.test(value)) {
                                invalids.push(this);
                            }
                        }
                    }
                    else if(required) {
                        invalids.push(this);
                    }
                }
            });

            if(invalids.length > 0) {
                e.preventDefault();
                settings.fail.call(form, e, invalids, data);
            } else {
                settings.success.call(form, e, data);
            }
        })
        // Disable default HTML5 validation
        .attr('novalidate', '');

    };

    $.fn.bootstrap3Validate = function(success, data) {
        return this.validate({
            'init': function() {
                $('.has-error', this).removeClass('has-error').find('input,textarea').tooltip('destroy');
                $('.alert').hide();
                $("[role='tooltip']", this).tooltip('destroy');
            },
            'success': function(e, data) {
                if (typeof(success) === 'function') {
                    success.call(this, e, data);
                }
            },
            'fail': function(e, invalids) {
                var form = this;

                $(invalids).closest('.form-group').addClass('has-error').find('input,select,textarea').each(function(i) {
                    var target = $(this);
                    var text = target.attr('data-title');
                    if(!text) {
                        text = target.attr('placeholder');
                    }

                    if(text) {
                        if(!target.is("[type='checkbox']")) {
                            target.tooltip({'trigger':'focus', placement: 'top', title: text});
                        }

                        if(i == 0) {
                            $('.alert-danger', form).show().text(text);
                            this.focus();
                        }
                    }
                });
            },
        });
    }

}( jQuery ));
