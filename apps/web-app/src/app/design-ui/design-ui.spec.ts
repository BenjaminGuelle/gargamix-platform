import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignUi } from './design-ui';

describe('DesignUi', () => {
  let component: DesignUi;
  let fixture: ComponentFixture<DesignUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
