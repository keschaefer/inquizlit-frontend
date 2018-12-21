import { Component, OnInit } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { GetQuestionsService } from '../get-questions.service';
import { GetAnswersService } from '../get-answers.service'
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

    faChevronUp = faChevronUp;
    faChevronDown = faChevronDown;
    questions: any;
    answers: any;
    filteredQuestions: any;

    constructor(private srv: GetQuestionsService, private asrv: GetAnswersService) { }

    ngOnInit() {
        this.getQuestions();
        this.getAnswers();
    }

    getQuestions() {
        this.srv.getData().subscribe(payload => {
            this.questions = payload;
            this.filteredQuestions = this.questions;
        })
    }

    getAnswers() {
        this.asrv.getData().subscribe(payload => {
            this.answers = payload;
        })
    }

    getNumberOfAnswers(id) {
        let count = this.answers.filter(answer => answer.question_id === id).length;
        if (count > 0) {
            return count;
        }
        return 0;
        // console.log(count)

    }

    filterQuestions(event) {
        var target = event.srcElement.innerHTML.toLowerCase();
        this.filteredQuestions = this.questions;
        if (target !== 'most popular') {
            this.filteredQuestions = this.questions.filter(question => question.tag === target);
            // this.questions = this.filteredQuestions;
            console.log(this.questions);
            //filter questions by most popular
            //set questions to this new filter
        } else if (target === 'most popular') {
            this.filteredQuestions = this.questions.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
            // homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
        console.log('cats')
        // if (val === '') {
        //     return
        // }
    }

    upVoteQuestion(id) {
        fetch(`https://inquizlit-backend.herokuapp.com/questions/${id}/upvote`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            this.filteredQuestions.map(question => {
                if (question.id === id) {
                    return question.upvotes++;
                }
            })
        })
    }
    downVoteQuestion(id) {
        fetch(`https://inquizlit-backend.herokuapp.com/questions/${id}/downvote`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            this.filteredQuestions.map(question => {
                if (question.id === id) {
                    return question.downvotes++;
                }
            })
        })
    }

}
