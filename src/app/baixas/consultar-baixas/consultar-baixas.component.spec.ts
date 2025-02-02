import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarBaixasComponent } from './consultar-baixas.component';

describe('ConsultarBaixasComponent', () => {
  let component: ConsultarBaixasComponent;
  let fixture: ComponentFixture<ConsultarBaixasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarBaixasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarBaixasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
