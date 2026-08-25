import { Component } from '@angular/core';
import { ModalService } from '../../core/services/model/modal-service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  title = '';
  message = '';
  type = 'info';

  modal: any;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {

    const modalElement = document.getElementById('commonModal');
    this.modal = new bootstrap.Modal(modalElement);

    this.modalService.modalState$.subscribe(data => {
      if (data) {
        this.title = data.title;
        this.message = data.message;
        this.type = data.type;
        this.modal.show();
      }
    });
  }

  close() {
    this.modal.hide();
    this.modalService.close();
  }
}

