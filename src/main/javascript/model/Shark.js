function Shark(id, name, src, description) {
    this.id = id;
    this.name = name;
    this.src = src;
    this.description = description;
	
	this.setSeas=function(seas)
	{
		this.seas = seas;
	}	
	this.getSeas=function()
	{
		return seas;
	}
	
	this.setSize=function(size)
	{
		this.size = size;
	}	
	this.getSize=function()
	{
		return size;
	}
	
	this.setDiet=function(diet)
	{
		this.diet = diet;
	}	
	this.getDiet=function()
	{
		return diet;
	}
	this.getAge=function()
	{
		return age;
	}
	this.setAge =function(age)
	{
		this.age = age;
	}
	
	
	this.setOtherNames=function(otherNames)
	{
		this.otherNames = otherNames;
	}	
	this.getOtherNames=function()
	{
		return otherNames;
	}	
}
