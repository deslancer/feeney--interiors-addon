import { PostArgs, PostsBuilder } from './postsBuilder';
import { HandRailArgs, HandRailBuilder } from './handRailBuilder';
import { BaseRailArgs, BaseRailBuilder } from './baseRailBuilder';
import { InfillsBuilder } from './Infills/InfillsBuilder';
import { Singleton } from '../../../decorators/singleton';

interface BuildArgs {
  postsArgs: PostArgs;
  handRailArgs: HandRailArgs;
  baseRailArgs: BaseRailArgs;
  infillsArgs: any;
}

@Singleton
export class Builder {
  private readonly postsBuilder: PostsBuilder = new PostsBuilder();
  private readonly handRailBuilder: HandRailBuilder = new HandRailBuilder();
  private readonly baseRailBuilder: BaseRailBuilder = new BaseRailBuilder();
  private readonly infillsBuilder: InfillsBuilder = new InfillsBuilder();

  constructor() {}

  get posts() {
    return this.postsBuilder;
  }

  get handRail() {
    return this.handRailBuilder;
  }

  get baseRail() {
    return this.baseRailBuilder;
  }

  get infills() {
    return this.infillsBuilder;
  }

  async buildAll(args: BuildArgs) {
    const { postsArgs, handRailArgs, baseRailArgs, infillsArgs } = args;
    this.postsBuilder.build(postsArgs);
    this.handRailBuilder.build(handRailArgs);
    this.baseRailBuilder.build(baseRailArgs);
    this.infillsBuilder.build(infillsArgs);
  }

  async destroyAll() {
    this.postsBuilder.remove();
    this.handRailBuilder.remove();
    this.baseRailBuilder.remove();
    this.infillsBuilder.remove();
  }
}
