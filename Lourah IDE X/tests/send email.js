// SendEmail.js - Prefill recipient, subject, message and run email-client

var Intent = Packages.android.content.Intent; 

// Java: String recipients[] = { "recipient@gmail.com" };
var recipients  = java.lang.reflect.Array.newInstance(java.lang.String, 20);
recipients[0] = "recipient@gmail.com";
recipients[1] = "gibbons@zz.top";

var emailIntent = new Intent(Intent.ACTION_SEND);
emailIntent.putExtra(Intent.EXTRA_EMAIL, recipients);
emailIntent.putExtra(Intent.EXTRA_SUBJECT, "Very important: please review");
emailIntent.setType("plain/text");
emailIntent.putExtra(Intent.EXTRA_TEXT, "Hi,\n\nNow that I have your attention...");

Activity.startActivity(emailIntent); 
