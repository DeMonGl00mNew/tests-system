import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureTestComponent } from './configure-test.component';

describe('ConfigureTestComponent', () => {
  let component: ConfigureTestComponent;
  let fixture: ComponentFixture<ConfigureTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
