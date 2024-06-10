BEGIN {
	RS="\n";
	count=0;
	offset = 3;
}
{

	line = $0;
	# gsub(/\s+/, "", line);
	print offset  ":\""  line  "\"";
	offset += length(line) + 1;
	count++;
}
END {
	print count;
}
