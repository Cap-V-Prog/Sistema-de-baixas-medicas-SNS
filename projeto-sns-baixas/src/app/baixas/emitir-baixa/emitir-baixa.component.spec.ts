import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirBaixaComponent } from './emitir-baixa.component';

describe('EmitirBaixaComponent', () => {
  let component: EmitirBaixaComponent;
  let fixture: ComponentFixture<EmitirBaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmitirBaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmitirBaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
