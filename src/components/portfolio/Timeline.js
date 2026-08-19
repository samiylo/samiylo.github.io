import React from 'react';
import FloatingShapes from '../common/FloatingShapes';
import { CalculusChart } from './CalculusChart';
import { TaylorChart } from './TaylorChart';
import { PIDChart } from './PIDChart';
import { RoboticArmChart } from './RoboticArmChart';

export const Timeline = () => {
  return (
    <section className="timeline" id="timeline">
      <div className="timeline-background">
        <FloatingShapes 
          count={18} 
          minSize={6} 
          maxSize={65} 
          minDelay={1} 
          maxDelay={10} 
          minDuration={5} 
          maxDuration={15}
          className="timeline-floating-shapes"
        />
      </div>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <CalculusChart />
            <TaylorChart />
            <PIDChart />
            <RoboticArmChart />
          </div>
        </div>
      </div>
    </section>
  );
}; 