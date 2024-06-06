import {
  debounceTime,
  filter,
  groupBy,
  mergeMap,
  Subject,
  Subscription,
} from 'rxjs';

type AAC = BaseAutoCompletion<any>;

let instance: AutoCompletionManager<AAC> | null = null;

export function getAutoCompletionManager<
  T extends AAC,
>(): AutoCompletionManager<T> {
  if (instance === null) {
    instance = new InternalAutoCompletionManager<T>();
  }

  return instance as AutoCompletionManager<T>;
}

export interface BaseAutoCompletion<T> {
  type: string;
  dataType: T[];
}

type IngredientResponse = string;

export interface IngredientAutoCompletion
  extends BaseAutoCompletion<IngredientResponse> {
  type: 'ingredient';
}

type AutoCompletionRequest<T extends AAC> = {
  type: T['type'];
  data: string;
  origin: any;
};

type AutoCompletionResponse<T extends AAC> = {
  type: T['type'];
  data: T['dataType'];
  origin: any;
};

const AutoCompletionRequestSubject$ = new Subject<AutoCompletionRequest<any>>();
const AutoCompletionResponseSubject$ = new Subject<
  AutoCompletionResponse<any>
>();
const AutoCompletionService = {
  onRequest: AutoCompletionRequestSubject$.asObservable(),
  onResponse: AutoCompletionResponseSubject$.asObservable(),
  request<T extends AAC>(req: AutoCompletionRequest<T>) {
    AutoCompletionRequestSubject$.next(req);
  },
  response<T extends AAC>(res: AutoCompletionResponse<T>) {
    AutoCompletionResponseSubject$.next(res);
  },
};

class InternalAutoCompletionManager<T extends AAC> {
  constructor() {
    AutoCompletionService.onRequest
      .pipe(
        groupBy(req => `${req.type}-${req.origin}`),
        mergeMap(group$ => group$.pipe(debounceTime(400))),
      )
      .subscribe(async req => {
        const acRequest = await fetch(
          `http://10.0.2.2:8000/autocompletion?type=${req.type}&data=${req.data}`,
          {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (acRequest.status !== 200) {
          console.warn(acRequest.statusText);
          return;
        }

        const result = await acRequest.json();
        const response: AutoCompletionResponse<AAC> = {
          type: req.type,
          data: result,
          origin: req.origin,
        };
        AutoCompletionService.response(response);
      });
  }

  request(type: T['type'], data: string, origin: any) {
    const request: AutoCompletionRequest<T> = {
      type: type,
      data: data,
      origin: origin,
    };
    AutoCompletionService.request<T>(request);
  }

  subscribe(
    type: T['type'],
    criteria: (origin: any) => boolean,
    consumer: (res: T['dataType']) => void,
  ): Subscription {
    return AutoCompletionService.onResponse
      .pipe(filter(res => res.type === type && criteria(res.origin)))
      .subscribe(res => consumer(res.data));
  }
}

export type AutoCompletionManager<T extends AAC> = InstanceType<
  typeof InternalAutoCompletionManager<T>
>;
