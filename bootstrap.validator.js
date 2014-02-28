(function ( $ ) {

	$.fn.validate = function( options ) {

		var settings = $.extend({
			init: function() {},
			success: function() {},
			fail: function(invalids) {}
		}, options );


        return this.on('submit', function(e) {
            var form = this;
            var invalids = [];

            settings.init.call(form);

            $("[data-regex],[data-require],[required],[data-equals]", form).each(function() {
                var self = $(this);
                var regex = self.attr('data-regex');
                var required = self.is('[data-require]') || self.is('[data-required]');
                var equals = self.attr('data-equals');
                var value = self.val();

                if(self.is("[type='checkbox']") && !self.is(":checked")) value='';

                if(typeof(equals) != 'undefined') {
                    var target = $("[name='" + equals + "']", form);
                    var value2 = target.val();
                    if(value != value2) {
                        invalids.push(this);
                        invalids.push(target.get(0));
                    }
                }

                if(value && value.length > 0) {
                    var r;
                    if(regex == 'email') {
                        r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    } else if(regex == 'tel') {
                        r = /^[0-9\-\+]{3,25}$/;
                    } else {
                        r = new RegExp(regex);
                    }
                    if(!r.test(value)) {
                        invalids.push(this);
                    }
                } else if(required) {
                    invalids.push(this);
                }
            });

            if(invalids.length > 0) {
                e.preventDefault();
                settings.fail.call(form, invalids);
            } else {
                settings.success.call(form, e);
            }
        });

    };

    $.fn.bootstrap3Validate = function(success) {
        return this.validate({
			'init': function() {
				$('.has-error', this).removeClass('has-error').find('input,textarea').tooltip('destroy');
				$('.alert').hide();
				$('[rel=tooltip]', this).tooltip('destroy');
			},
			'success': function(e) {
				if (typeof(success) === 'function') {
					success.call(this, e);
				}
			},
			'fail': function(invalids) {
				var form = this;

				$(invalids).closest('.form-group').addClass('has-error').find('input,select,textarea').each(function(i) {
					var text = $(this).attr('data-title');
					if(!text) {
						text = $(this).attr('placeholder');
					}

					if(text) {
						$(this).tooltip({'trigger':'focus', placement: 'top', title: text});

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