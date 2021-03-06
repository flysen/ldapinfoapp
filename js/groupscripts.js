    function loadGroup(groupdn) {
        $.get("adinfo.php/group/" + groupdn, function(data, status){
	    if (data.error) {
		$("#groupinfo").html('<h3>Error</h3><p>' + data.error + '</p>');
	    } else {
		str = '<h2>' + data.name + '</h2>';
		str += '<h3>GID: ' + data.gidnumber + '</h3>';
		str += '<h3>Is a member of these groups</h3><div class="groups"><ul>';
		data.groups.forEach(function(item, index) {
                    str += '<li><a href="group.php?dn=' + encodeURIComponent(item.dn) + '">' + item.title + ' (' + item.section + ')</a></li>';
		});
		str += '</ul></div>';
		str += '<h3>Technical stuff</h3><table class="tech">';
		str += '<th>DN</th><td>' + data.dn + '</td></tr>';
		str += '<tr><th>SID</th><td>' + data.objectsid + '</td></tr>';
		str += '<th>GUID</th><td>' + data.objectguid + '</td></tr>';
		str += '</table>';
		$("#groupinfo").html(str);
	    }
        }).fail(function() {
	    $("#groupinfo").html('<h3>Error contacting directory server</h3>');
        });
    }

function makeList(mytree) {
    s = '<ul>';
    for (var id in mytree) {
	if (mytree.hasOwnProperty(id)) {
	    if (mytree[id].title) {
                s += '<li>';
		s += '<a href="group.php?dn=' + encodeURIComponent(mytree[id].dn) + '">' + mytree[id].title + '</a>';
		s += makeList(mytree[id].members);
	    } else {
		s += '<li data-jstree=\'{"icon":"user.png"}\'>';
		s += '<a href="user.php?username=' + encodeURIComponent(id) + '">' + mytree[id].displayname + ' (' + id + ')</a>';
	    }
	    s += '</li>';
	}
    }
    s += '</ul>';
    return s;
}

    function loadGroupMembers(groupdn) {
	var target = document.getElementById('spinhere');
	var opts = {
	    lines: 13, // The number of lines to draw
	    length: 38, // The length of each line
	    width: 17, // The line thickness
	    radius: 45, // The radius of the inner circle
	    scale: 1, // Scales overall size of the spinner
	    corners: 1, // Corner roundness (0..1)
	    color: '#000000', // CSS color or array of colors
	    fadeColor: 'transparent', // CSS color or array of colors
	    opacity: 0.25, // Opacity of the lines
	    rotate: 0, // The rotation offset
	    direction: 1, // 1: clockwise, -1: counterclockwise
	    speed: 1, // Rounds per second
	    trail: 60, // Afterglow percentage
	    fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
	    zIndex: 2e9, // The z-index (defaults to 2000000000)
	    className: 'spinner', // The CSS class to assign to the spinner
	    top: '200px', // Top position relative to parent
	    left: '50%', // Left position relative to parent
	    shadow: 'none', // Box-shadow for the lines
	    position: 'absolute' // Element positioning
	};
	var spinner = new Spinner(opts).spin(target);
        $.get("adinfo.php/groupmembers/" + groupdn, function(data, status){
	    if (data.error) {
		$("#groupmembers").html('<h3>Error</h3><p>' + data.error + '</p>');
	    } else {
		$("#groupmembers").html(makeList(data));
		$("#groupmembers").jstree();
		$("#groupmembers").on('changed.jstree', function (e, data) {
		    if (data.node.a_attr.href) {
			window.location=data.node.a_attr.href;
		    }
		});
	    }
	    spinner.stop();
        }).fail(function() {
	    $("#groupmembers").html('<h3>Error contacting directory server</h3><p>DN=' + groupdn + '</p>');
	    spinner.stop();
	});
    }

