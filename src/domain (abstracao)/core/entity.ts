export abstract class Entity<T> {
    constructor(protected props: T) { }

    get fields() {
        return this.props;
    }
}
