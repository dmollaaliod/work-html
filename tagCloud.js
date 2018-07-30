/** limits for different font-sizes */
var lim1;
var lim2;

var limit = 0;
var order;

/** 
* Retrieves tags from BibSonomy 

* param url: the url of the JSON feed
* param limit: tag limitation
* param order: order of the tags (tagname or tagcount)
*/
function getTags(url, lim, ord) {
	limit = lim;
	order = ord;

	var headID = document.getElementsByTagName("head")[0];         
	var newScript = document.createElement("script");
	newScript.type = "text/javascript";
	newScript.src = url + "?callback=jsonBibSonomyFeed";
	headID.appendChild(newScript);
}

/** 
* Handler function 
*/
function jsonBibSonomyFeed(feed) {
	var div = document.getElementById("tags");	
 	var ultag = document.getElementById("tagbox");
 	var maxCount = -1000;
 	var minCount = 1000;
  	
  	for(x=0; x < feed.tags.length; x++){
		var tagCount = feed.tags[x].count;
		if (tagCount < minCount)
			minCount = tagCount;
		if (tagCount > maxCount)
			maxCount = tagCount;			
	}		
	var diff = maxCount - minCount;
	var part = diff / 3;	
	lim2 = maxCount - part;
	lim1 = lim2 - part;

	// remove old tags	
	var lilength = ultag.getElementsByTagName("LI").length;
	while (lilength > 0) {
		ultag.removeChild(ultag.firstChild);
		lilength = ultag.getElementsByTagName("LI").length;
	}

	// limitation
	if (limit == 0 || limit > feed.tags.length)
		limit = feed.tags.length;

	// sort to frequency and cut after limit
	feed.tags = feed.tags.sort(softFreq);
	feed.tags = feed.tags.slice(0,limit);		

	// sort 
	feed.tags = feed.tags.sort(comparator);
	
	// insert new tags
  	var space = document.createTextNode(" ");
	for(var x=0; x < feed.tags.length; x++){
		var tagname = feed.tags[x].name;
		var tagcount = feed.tags[x].count;
		var clazz = getClazz(tagcount);
		
		var newli = document.createElement("LI");

		var newa = document.createElement("A");
		newa.href = "http://www.bibsonomy.org/tag/" + tagname;
		newa.innerHTML = tagname;
		newa.className = clazz;
		
		newli.appendChild(newa);
		newli.appendChild(space.cloneNode(true));
		ultag.appendChild(newli);
	} 		
}

/**
* compartor function for array sort
**/
function comparator(x,y) {
	if (order == "frequency") {
		var count1 = x.count;	
		var count2 = y.count;	
		
		return count2 - count1;	
	} else {
		var name1 = x.name.toLowerCase();	
		var name2 = y.name.toLowerCase();
		
		return (name1 == name2) ? 0 : (name1 < name2) ? -1 : 1			
	}
}

/**
* sorts array to frequency
**/
function softFreq(x,y) {
	var count1 = x.count;	
	var count2 = y.count;	
	
	return count2 - count1;	
}

/** 
* Computes the style class for a tag 
*/
function getClazz(count) {
	if (count > lim2)
		return "big";
	if (count < lim1)
		return "small";
	return "normal";
}