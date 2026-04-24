#!/usr/bin/perl

use CGI;
use JSON;
use String::Random;
use DBI;

my $server = "127.0.0.1";
#my $server2 = "aspen.room-house.com";
my $server2 = "xxx.room-house.com";
my $port = 5432;
#my $port2 = 5432;
my $port2 = 5432;
my $user = "postgres";
my $passwd = "x";
my $dbase = "xx";
my $ret = "ERR";

my $query = new CGI;

my %headers = map { $_ => $query->http($_) } $query->http();

my $file = defined($query->param('file')) ? $query->param('file') ne 'undefined' ? $query->param('file') : '' : '';
my $type = defined($query->param('type')) ? $query->param('type') ne 'undefined' ? $query->param('type') : '' : '';
my $desc = defined($query->param('description')) ? $query->param('description') ne 'undefined' ? $query->param('description') : '' : '';
my $tname = defined($query->param('name')) ? $query->param('name') ne 'undefined' ? $query->param('name') : '' : '';
my $acc = defined($query->param('account')) ? $query->param('account') ne 'undefined' ? $query->param('account') : '' : '';

print STDERR "TYPE IS $type, FILE IS $file!\n";

exit unless (length($file) && length($type));

$dbconn=DBI->connect("dbi:Pg:dbname=$dbase;port=$port;host=$server",$user, $passwd);
$dbconn2=DBI->connect("dbi:Pg:dbname=$dbase;port=$port2;host=$server2",$user, $passwd);

$dbconn->{LongReadLen} = 16384;
$dbconn2->{LongReadLen} = 16384;

my $dir = $type eq 'i' ? "images" : $type eq 'j' ? "metadata" : '';
print STDERR "DIR IS $dir!\n";
exit unless length($dir);

#my $base = "/opt/nvme2/apache_store/";
my $base = "/opt/nvme2/apache_super_store/";
my $sr = String::Random->new;
my $random = $sr->randregex('[a-zA-Z]{24}');
 
if ($type eq 'i') {

	open(LOCAL, "> $base/$dir/$random") or die 'error';
	my $file_handle = $query->upload('file');

	while(<$file_handle>) {
		print LOCAL $_;
	}

	close($file_handle);
	close(LOCAL);

	print STDERR "ret is $random!\n";	
	$ret = $random;
}

if ($type eq 'j') {
	$file =~ m/^.*(\/)(.+)$/;
	# strip the remote path and keep the filename
	my $name = $2;
	
	my @chu = split('\?', $name);
	
	$name = $chu[0];
	
	$name =~ s/\"/\'/g; 
 	$desc =~ s/\"/\'/g;
	$desc =~ s/(\n|\r)/\|/g;
        $tname =~ s/\"/\'/g;
	$tname =~ s/(\n|\r)/\|/g;
        $file =~ s/\"//g;
	
	$acc =~ s/\"/\'/g;
	$acc =~ s/(\n|\r|\')//g;

	open(LOCAL, "> $base/$dir/$name") or die 'error';
	print LOCAL "{\"name\":\"".$tname."\",\"description\":\"".$desc."\",\"image\":\"".$file."\"}";
	close(LOCAL);

	my $cmd = "insert into tokens (name, description, image, hash, creator, date_and_time) values (?, ?, ?, ?, ?, current_timestamp)";
	my $result=$dbconn->prepare($cmd);
	my $result2=$dbconn2->prepare($cmd);
	$result->execute($tname, $desc, $file, $name, $acc);
	$result2->execute($tname, $desc, $file, $name, $acc);
	
	print STDERR "ret is $name!\n";	
	$ret = $name;
}

print STDERR "Got the following headers:\n";
for my $header ( keys %headers ) {
    print STDERR "$header: $headers{$header}\n";
}
         
print $query->header();
my %hash = ('result' => $ret);
$j = encode_json(\%hash);
print $j;

$dbconn->disconnect;
$dbconn2->disconnect;
exit;
