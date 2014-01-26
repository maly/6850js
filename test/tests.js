module("Syntax and coding standards");

jsHintTest( "JSHint", "../../emu/6850.js");

module("Basic tests");

test( "Namespace", function() {
	notEqual( MC6850, null, "MC6850 is defined" );
    equal( typeof(MC6850), "function", "MC6850 is an function" );
});

test( "Instantiate", function() {
	var sys= new MC6850();
	notEqual( sys, null, "Object instanted" );
    equal( typeof(sys), "object", "Object instantiated" );
	ok( sys instanceof MC6850, "Object instanted" );
});


module("Simple data tests");

test( "Receive a byte", function() {
	var tst= new MC6850();
	tst.setControl(0x10);
	tst.receive(0x55);
	var status = tst.getStatus();
	equal(status & 0x01, 0x01, "RDRF set OK");
    equal( tst.getData(), 0x55, "Data received OK" );
    status = tst.getStatus();
    equal(status & 0x01, 0x00, "RDRF reset OK");
});


asyncTest ("Transmit a byte", function() {
	tst= new MC6850();
	tst.setControl(0x10);
	var status = tst.getStatus();
	equal(status & 0x02, 0x02, "TDRE empty OK");
	tst.hook('transmit',function(tx){
		var status = tst.getStatus();
		equal(status & 0x02, 0x00, "TDRE full OK")	;

		equal(tx, 10, "Transmission OK");
		start();
	});
	tst.setData(10);
});


test( "Reset", function() {
		var tst= new MC6850();
		tst.setControl(0x10);
		tst.receive(0x55);
		tst.reset();
	    notEqual( tst.getData(), 0x55, "Reset OK" );
});

test( "Receive and overrun", function() {
	var tst= new MC6850();
	tst.setControl(0x10);
	tst.receive(0x55);
	tst.receive(0xaa);
	var status = tst.getStatus();
	equal(status & 0x01, 0x01, "RDRF set OK");
	equal(status & 0x20, 0x20, "OVRN set OK");
    equal( tst.getData(), 0x55, "Data received OK" );
    status = tst.getStatus();
    equal(status & 0x01, 0x00, "RDRF reset OK");
	equal(status & 0x20, 0x00, "OVRN reset OK");
});


/*
module("Simple init tests");

test ("Clear storage", function() {
	ok(FS.clear(), "FS.clear() goes well");
	equal(FS.filesCount(),0,"Files count is 0");
});

module("Simple file manipulations");

test ("File save", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.filesCount(),1,"Files count is 1 now");
	notEqual(FS.dir().indexOf('foo'),-1,"File 'foo' is in listing");
});

test ("File save - dir() test", function() {
	FS.clear();
	FS.save('foo', 'bar');
	deepEqual(FS.dir(),['foo'],"File 'foo' is in dir list");
});


test ("Two files saved", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File foo saved");
	ok(FS.save('bar', 'bar'), "File bar saved");
	equal(FS.filesCount(),2,"Files count is 2 now");
});


test ("Same file saved twice", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	ok(FS.save('foo', 'baz'), "File saved second time");
	equal(FS.filesCount(),1,"Files count is 1 now");
});

test ("File read", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foo'),'bar',"File contents is 'bar'");
});
test ("File with unicode characters", function() {
	FS.clear();
	ok(FS.save('foo', 'ěščřžýáíé Příšerně žluťoučký kůň'), "File saved");
	equal(FS.load('foo'),'ěščřžýáíé Příšerně žluťoučký kůň',"File contents is 'bar'");
});
test ("Non-exist file read", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foox'),null,"File name 'foox' doesn't exist");
});
test ("File save-read-change-read", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foo'),'bar',"File contents is 'bar'");
	ok(FS.save('foo', 'baz'), "File changed");
	equal(FS.load('foo'),'baz',"File contents is 'baz' - changed");
});
test ("File remove", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foo'),'bar',"File contents is 'bar'");
	ok(FS.rm('foo'), "File removed");
	equal(FS.load('foo'),null,"File deleted sucessfully");
	equal(FS.dir().indexOf('foo'),-1,"File 'foo' isn't in listing");
});
test ("Non-exists file remove", function() {
	FS.clear();
	equal(FS.load('foo'),null,"File doesn't exist");
	equal(FS.rm('foo'), null, "File couldn't be removed, it doesn't exist");
});
test ("File remove must clean localStorage", function() {
	FS.clear();
	FS.save('foo', 'bar');
	ok(FS.rm('foo'), "File removed");
	equal(localStorage['foo'],null,"File removed from localStorage");
});
test ("Specific file remove", function() {
	FS.clear();
	ok(FS.save('foo1', 'bar1'), "File 1 saved");
	ok(FS.save('foo2', 'bar2'), "File 2 saved");
	ok(FS.rm('foo1'), "File 1 removed");
	equal(FS.load('foo1'),null,"File 1 deleted sucessfully");
	equal(FS.load('foo2'),"bar2","File 2 remains intact");
	equal(FS.dir().indexOf('foo1'),-1,"File 1 isn't in listing");
	deepEqual(FS.dir(),["foo2"],"File 2 is in listing");
});

test ("Crazy file names", function() {
	FS.clear();
	ok(FS.save('foo1', 'bar1'), "File 1 saved");
	ok(FS.save('dir/foo1', 'bar2'), "File 2 saved");
	ok(FS.save('dir/foo2', 'bar3'), "File 3 saved");
	ok(FS.save('dir2/foo', 'bar4'), "File 4 saved");
	equal(FS.load('foo1'),"bar1","File 1 ok");
	equal(FS.load('dir/foo1'),"bar2","File 2 ok");
	equal(FS.load('dir/foo2'),"bar3","File 3 ok");
	equal(FS.load('dir2/foo'),"bar4","File 4 ok");
});

module("Directory manipulation", {
	setup: function () {
		FS.clear();
		FS.save('foo1', 'bar1');
		FS.save('dir/foo1', 'bar2');
		FS.save('dir/foo2', 'bar3');
		FS.save('dir2/foo', 'bar4');
		FS.save('dir3/subdir/foox', 'bar5');
	}
});

test ("Simple directory structure", function() {
	deepEqual(FS.dir('dir2'),['foo'], "file 'foo' in directory 'dir2'");
	deepEqual(FS.dir('dir'),['foo1','foo2'], "files 'foo1' and 'foo2' in directory 'dir'");
});

test ("Working directory", function() {
	equal(FS.pwd(),'/', "WD is /");
});

test ("Working directory change", function() {
	ok(FS.cd("dir"), "cd dir");
	equal(FS.pwd(),'/dir/', "WD is /dir/");
	ok(FS.cd("/"), "cd /");
	equal(FS.pwd(),'/', "WD is / now");
});
test ("Working directory deep change", function() {
	ok(FS.cd("dir3"), "cd dir3");
	equal(FS.pwd(),'/dir3/', "WD is /dir3/");
	ok(FS.cd("subdir"), "cd subdir");
	equal(FS.pwd(),'/dir3/subdir/', "WD is /dir3/subdir");
	ok(FS.cd("/"), "cd /");
	equal(FS.pwd(),'/', "WD is / now");
});
test ("Working directory change + ls", function() {
	ok(FS.cd("dir2"), "cd dir");
	equal(FS.pwd(),'/dir2/', "WD is /dir2/");
	deepEqual(FS.dir(),['foo'], "file 'foo' in directory 'dir2'");
});
test ("Working directory change with ..", function() {
	ok(FS.cd("dir"), "cd dir");
	equal(FS.pwd(),'/dir/', "WD is /dir/");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/', "WD is / now");
});
test ("Working directory deep change with ..", function() {
	FS.cd("/dir3/subdir");
	equal(FS.pwd(),'/dir3/subdir/', "WD is /dir3/subdir");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/dir3/', "WD is /dir3/");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/', "WD is / now");
	FS.cd("/dir3/subdir");
	equal(FS.pwd(),'/dir3/subdir/', "WD is /dir3/subdir");
	ok(FS.cd("../.."), "cd ../..");
	equal(FS.pwd(),'/', "WD is / again");
});
test ("getSubdirs()", function() {
	ok(FS.cd("dir"), "cd dir");
	equal(FS.pwd(),'/dir/', "WD is /dir/");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/', "WD is / now");
});

module("Backup and restore tests", {
	setup: function () {
		FS.clear();
		FS.save('foo1', 'bar1');
		FS.save('dir/foo1', 'bar2');
		FS.save('dir/foo2', 'bar3');
		FS.save('dir2/foo', 'bar4');
		FS.save('dir3/subdir/foox', 'bar5');
	}
});

test("backup", function() {
	ok(FS.backup(), "Backup works");
});

test("restore", function() {
	var bak = FS.backup();
	FS.clear();
	ok(FS.restore(bak), "Restore works");
});

test ("Files restored OK", function() {
	var bak = FS.backup();
	FS.clear();
	FS.restore(bak);
	equal(FS.load('foo1'),'bar1',"File contents is 'bar'");
});


module("Backup and restore with ZIP", {
	setup: function () {
		FS.clear();
		FS.save('foo1', 'bar1');
		FS.save('dir/foo1', 'bar2');
		FS.save('dir/foo2', 'bar3');
		FS.save('dir2/foo', 'bar4');
		FS.save('dir3/subdir/foox', 'bar5');
	}
});

test("backup", function() {
	ok(FS.zip(), "ZIP works");
});

test("restore", function() {
	var bak = FS.zip();
	FS.clear();
	ok(FS.unzip(bak), "Restore works");
});

test ("Files restored OK", function() {
	var bak = FS.zip();
	FS.clear();
	FS.unzip(bak);
	equal(FS.load('foo1'),'bar1',"File contents is 'bar'");
});


module("Change hooks", {
	setup: function () {
		FS.clear();
	},
});

asyncTest("Hook change handler", function() {
	FS.onChange(function(){ok(true, "Hook on save");FS.onChange(null);start();});
	FS.save("foo","bar");
});
*/