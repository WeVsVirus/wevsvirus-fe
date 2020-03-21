import debounce from 'lodash/debounce';

import {Component, Input, OnInit} from '@angular/core';
import {IQuestionnaire, QuestionnaireService} from '../services/questionnaire.service';
import {UserService} from '../services/user.service';
import {MoodQuestion, HealthQuestion} from '../services/question.service';

@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.page.html',
    styleUrls: ['./questionnaire.page.scss'],
})
export class QuestionnairePage implements OnInit {

    private state: IQuestionnaire;

    private debouncedSave: any;

    @Input()
    public moode = true;

    constructor(
        private readonly userService: UserService,
        private readonly questService: QuestionnaireService,
    ) {
    }

    ngOnInit() {
        this.state = {
            userId: this.userService.user.id,
            responseDate: new Date().toISOString().substring(0, 10),
            moodResponses: [],
            healthResponses: [],
        };
        const fn = () => {
            this.questService.save(this.state);
        };

        this.debouncedSave = debounce(fn, 200);
    }

    async onMoodResponse(event: MoodQuestion[]) {
        this.state.moodResponses = event.map(({id, value}) => ({
            questionId: id,
            response: value,
        }));

        this.debouncedSave();
        // await this.questService.save(this.state);
    }

    async onHealthResponse(event: HealthQuestion[]) {
        this.state.healthResponses = event.map(({id, value}) => ({
            questionId: id,
            response: value,
        }));

        this.debouncedSave();
        // await this.questService.save(this.state);
    }

}
