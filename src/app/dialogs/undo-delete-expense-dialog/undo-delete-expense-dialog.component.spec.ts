import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoDeleteExpenseDialogComponent } from './undo-delete-expense-dialog.component';

describe('UndoDeleteExpenseDialogComponent', () => {
  let component: UndoDeleteExpenseDialogComponent;
  let fixture: ComponentFixture<UndoDeleteExpenseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoDeleteExpenseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoDeleteExpenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
