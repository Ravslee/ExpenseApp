import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpenseDailogComponent } from './delete-expense-dailog.component';

describe('DeleteExpenseDailogComponent', () => {
  let component: DeleteExpenseDailogComponent;
  let fixture: ComponentFixture<DeleteExpenseDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteExpenseDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteExpenseDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
