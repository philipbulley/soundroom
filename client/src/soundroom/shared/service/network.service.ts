import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { AppState } from '../model/app-state';

@Injectable()
export class NetworkService {

  /**
   * An exponential backoff strategy is used when loading playlist data, but we won't allow that exponential delay
   * exceed this value.
   * @type {number}
   */
  private MAX_RETRY_INTERVAL: number = 30;

  constructor(private store$: Store<AppState>) {

  }

  /**
   * Use with the `retryWhen()` operator for an exponential backoff retry strategy
   *
   * @example
   *
   *     Observable.retryWhen(errors => this.retry(errors))
   *
   * @param errors
   * @param maxRetries
   */
  retry(errors: Observable<any>, maxRetries: number = null): Observable<any> {
    return errors
      .mergeMap((err, count) => {
        if (maxRetries && count === maxRetries) {
          return Observable.throw(err);
        }

        // Calc number of seconds we'll retry in using exponential backoff
        const retrySecs = Math.min(Math.round(Math.pow(++count, 2)), this.MAX_RETRY_INTERVAL);
        console.warn(`NetworkService.retry: Retry ${count} in ${retrySecs} seconds`);

        // Set delay
        return Observable.of(err)
          .delay(retrySecs * 1000);
      });
  }

  /**
   * Standard options we need to use when sending POST requests to the server
   */
  get requestOptions() {

    const headers = {
      'Content-Type': 'application/json',
    };

    let cachedJwt: string;

    // TODO: Replace with selector
    this.store$
      .select((store: AppState) => store.auth.jwt)
      .take(1)
      .subscribe(jwt => cachedJwt = jwt);

    if (cachedJwt) {
      headers['Authorization'] = `JWT ${cachedJwt}`;
    }

    return new RequestOptions({
      headers: new Headers(headers),
    });
  }
}
