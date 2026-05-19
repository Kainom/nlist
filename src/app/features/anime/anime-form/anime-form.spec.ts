import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeForm } from './anime-form';

describe('AnimeForm', () => {
  let component: AnimeForm;
  let fixture: ComponentFixture<AnimeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
