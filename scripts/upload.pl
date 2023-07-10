#!/usr/bin/perl

use CGI;
use JSON;
use String::Random;

my $ret = "ERR";

my $query = new CGI;

my %headers = map { $_ => $query->http($_) } $query->http();

my $file = defined($query->param('file')) ? $query->param('file') ne 'undefined' ? $query->param('file') : '' : '';
my $type = defined($query->param('type')) ? $query->param('type') ne 'undefined' ? $query->param('type') : '' : '';
my $desc = defined($query->param('description')) ? $query->param('description') ne 'undefined' ? $query->param('description') : '' : '';
my $tname = defined($query->param('name')) ? $query->param('name') ne 'undefined' ? $query->param('name') : '' : '';

print STDERR "TYPE IS $type, FILE IS $file!\n";

exit unless (length($file) && length($type));
 
my $dir = $type eq 'i' ? "images" : $type eq 'j' ? "metadata" : '';
print STDERR "DIR IS $dir!\n";
exit unless length($dir);

my $base = "/opt/nvme2/apache_store/";
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
        $tname =~ s/\"/\'/g;
        $file =~ s/\"//g;

	open(LOCAL, "> $base/$dir/$name") or die 'error';
	print LOCAL "{\"name\":\"".$tname."\",\"description\":\"".$desc."\",\"image\":\"".$file."\"}";
	close(LOCAL);

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
exit;
