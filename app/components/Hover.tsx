import { Button } from '@app/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

const HoverCardInstance = (props: any) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant='link' type='button' size='link'>
          {props.title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div>{props.content}</div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardInstance;
