$(document).ready(function(){

	// Get consulting user to update
	$('#modalUpdate').on('shown.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var idUser = button.data('id');	
		var modal = $(this);	
	  	$.ajax({
	  		url: '/admin/findUpdate/'+ idUser,
	  		type:'GET',
	  		dataType:'json',
	  		success: function(res){
	  			var User = res.user;	  			
	  			modal.find('.modal-title').text('Actualizando datos para: '+ User.username);
	  			modal.find('.modal-body input#recipient-username').val(User.username);
	  			modal.find('.modal-body input#recipient-email').val(User.email);
	  			modal.find('.modal-body input#recipient-firstname').val(User.firstname);
	  			modal.find('.modal-body input#recipient-lastname').val(User.lastname);
	  			modal.find('.modal-body input#recipient-phone').val(User.phone);

	  			$('#btn-update-user').attr('data-id', User._id);
	  		}
	  	});	  	
	});

	// Button to send data and update user after consulted
	$('#btn-update-user').on('click', function(e){
		e.preventDefault();		
		$button = $(this);
		var idUser = $button.data('id');
		var datos = $('#form-update-user').serialize(); 
		$.ajax({
	  		url: '/admin/update/' + idUser,
	  		type:'POST',
	  		data:datos,
	  		dataType:'json',
	  		success: function(res){
	  			if(res.error){
	  				alert(res.error);
	  			}else{
	  				window.location='/admin/list_users';
	  			}
	  		}
	  	});
	})
})