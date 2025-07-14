import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PollService } from '../poll';
import { Poll } from '../poll.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.html',
  styleUrls: ['./poll.css']
})
export class PollComponent implements OnInit{
  newPoll: Omit<Poll, 'id'> = {
    question: '',
    options: [
      { optionText: '', voteCount: 0 },
      { optionText: '', voteCount: 0 }
    ]
  };
  
  
  polls: Poll[] = [];

  constructor(private pollService: PollService,
    private cdr: ChangeDetectorRef
  ) {
    
  }


  ngOnInit(): void {
    this.loadPolls();
  }


  loadPolls(){
    // Logic to load polls will go here
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
      },
      error: (error) => {
        console.error('Error Fetching polls', error);
      }
    });
  }

  addOption(){
    this.newPoll.options.push({ optionText: '', voteCount: 0 });
  }

  removeOption(){
    
  }


  createPoll(){
    console.log("Poll envoyé :", JSON.stringify(this.newPoll));
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createdPoll) => {
        this.polls.push(createdPoll);
        this.resetPoll();
      },
      error: (error) => {
        console.error('Error Creating polls', error);
      }
    })
  }

  resetPoll(){
    this.newPoll = {
    question: '',
    options: [
      { optionText: '', voteCount: 0 },
      { optionText: '', voteCount: 0 }
    ]
  };
  this.cdr.detectChanges(); 
}

  vote(pollId: number, optionIndex: number){
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () => {
        const poll = this.polls.find(p => p.id === pollId);
        if(poll){
          poll.options[optionIndex].voteCount++;
        }
      },
      error: (error) => {
        console.error('Error voting on a', error);
      }
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  
}
