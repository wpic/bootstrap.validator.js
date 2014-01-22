# How to use it?
###HTML
	<input
		name="name"
		type="text"

		data-title="This is a message show after validation failed"
		data-regex="^[a-z]{1,10}"
		data-require=""
	/>

###CSS
	$(selector).validate({
		init: function() {

		},
		success: function() {

		},
		fail: function(invalids) {

		}
	})

* data-title: Error description. With $(invalids[i]).attr('data-title') you can get it. For bootstrap3Validate just put it there you don't need to do anything
* data-regex: Validation regex. You can also put 'email' and 'tel'
* data-require: required or not

# For bootstrap3:
###CSS
	form .alert,
	form .process
	{
		display: none;
	}
###HTML
	<form id="add_subscriber" method="POST" action="/api?api=management&amp;add=subscriber">
		<feildset>
			<!-- if edit == true, server make you able to override subscriber -->
			<input type="text" name="edit" />

			<div class="form-group">
				<label class="control-label">Sample:</label>
				<input name="name" class="form-control" placeholder="Smaple item" data-title="aSmple message" data-require="" data-regex="^[a-zA-Z]{1,30}$" />
			</div>
			<div class="progress progress-striped active">
				<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
					<span class="sr-only">Please wait...</span>
				</div>
			</div>
			<div class="alert alert-danger">

			</div>
			<div class="alert alert-success">
				Sent!
			</div>
			<div class="form-group text-center">
				<button class="btn btn-default" type="submit">Submit</button>
			</div>
		</feildset>
	</form>
###Javascript
	$(selector).bootstrap3Validate(function(e) {
		e.preventDefault();

		$('.process', self).show();
		$("[type='submit']", self).hide();
		$(".alert-danger", self).hide();

		$.ajax({
			url: $(this).attr('action'),
			data: $(this).serialize(),
			type: $(this).attr('method'),
		})
		.done(function() {
			$("[type='text']", self).val(''); // Clear
		})
		.fail(function() {
			$('.alert-danger', self).text('Error!').show();
		})
		.always(function() {
			$('.process', self).hide();
			$("[type='submit']", self).show();
		});
	})