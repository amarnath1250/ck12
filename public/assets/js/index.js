class Books{
	constructor(){
		this.render();
	}
	async render(){
		await this.fetchChapters();
		this.displayChapters();
		this.fetchLessons();	
	}
	async fetchChapters(){
		var self = this;
		const chaptersResponse = await fetch('/api/book/maths');
		const chaptersJson = await chaptersResponse.json();
		this.chapters = chaptersJson.response;
		this.chapters.sort((item1,item2) => { return item1.sequenceNO - item2.sequenceNO});
	}
	async fetchLessons(){
		books.chapters.forEach(async (value,index) => {
			let chapterId = value.id;
			if(value.type == "chapter"){
				const lessonsResponse = await fetch('/api/book/maths/section/'+chapterId);
				const lessonsJson = await lessonsResponse.json();
				value.lessons = lessonsJson.response[chapterId];
				value.lessons.sort((item1,item2) => {return item1.sequenceNO - item2.sequenceNO});
				let lessonsContainer = document.getElementById('chapter-content-'+value.id);
				lessonsContainer.innerHTML = '';
				let ulItem = document.createElement('ul');
				let templateString = ``;
				value.lessons.forEach(function(lesson,position){
			    	templateString += `<li><span class="lesson-counter">${value.sequenceNO}.${lesson.sequenceNO}</span>${lesson.title}`;
			    	if(lesson.status == "COMPLETE"){
			    		templateString += `<span class="lesson-status"> - Completed</span>`;
			    	}else if(lesson.status == "NOT_STARTED"){
			    		templateString += `<span class="lesson-status"> - Not Started</span>`;
			    	}else if(lesson.status == "IN_PROGRESS"){
			    		templateString += `<span class="lesson-status"> - In Progress</span>`;
			    	}
			    	templateString += `</li>`;
			    	ulItem.innerHTML = templateString;
		    		lessonsContainer.appendChild(ulItem);
			    });
			}
		});
	}
	displayChapters(){
		let self = this;
		let booksContainer = document.getElementById('books-container');
		booksContainer.innerHTML = '';
	    books.chapters.forEach(function(value,index){
	    	let bookItem = document.createElement('section');
	    	let templateString = ``;
	    	if(value.type == 'chapter'){
	    		templateString += `<div class="chapter-heading"><span class="chapter-heading-counter">${value.sequenceNO}.</span>${value.title}<span class="chapter-completion-count">${value.completeCount}/${value.childrenCount} Completed</span></div><div id="chapter-content-${value.id}" class="chapter-content"></div>`;
	    	}else{
	    		templateString += `<div class="lesson-heading"><span class="chapter-heading-counter">${value.sequenceNO}.</span>${value.title}</div>`;
	    	}
		    bookItem.innerHTML = templateString;
		    booksContainer.appendChild(bookItem);
	    });
	    let chaptersSelector = document.querySelectorAll('.chapter-heading');
		chaptersSelector.forEach(function(value,index){
			value.addEventListener('click', function(event){
				if(value.nextElementSibling.classList.contains('active')){
					value.nextElementSibling.classList.remove('active');
				}else{
					value.nextElementSibling.classList.add('active');
				}
			})
		});
	}
}
window.books = new Books();