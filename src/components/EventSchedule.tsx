import {vocaloidEventLists} from "@/data/vocaloidEventLists";

export function EventSchedule() {
  return (
      <div className="bg-white/5 rounded-lg p-6 text-white">
          <ul className="space-y-4">
              {vocaloidEventLists.map((event) => {
                  const eventDate = new Date(event.eventDate.replace(/\./g, '-'));
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const diffTime = eventDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  let status;
                  if (diffDays < 0) {
                      status = <span className="font-bold text-gray-500">종료</span>;
                  } else if (diffDays === 0) {
                      status = <span className="font-bold text-green-400">D-DAY</span>;
                  } else {
                      status = <span className="font-bold text-green-400">{`D-${diffDays}`}</span>;
                  }

                  return (
                      <li key={event.eventName} className="flex items-center justify-between">
                          <div>
                                        <span className="font-semibold gap-2">
                                            {event.eventName}
                                        </span>
                              <span className="ml-2">
                                            {event.eventSite && (
                                                <a
                                                    href={event.eventSite}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#39C5BB] hover:bg-[#FF7BAC] text-white font-semibold py-1 px-2 rounded text-xs"
                                                >
                                                    공식 사이트
                                                </a>
                                            )}
                                        </span>
                              <br/>
                              <span className="text-sm text-gray-400">{event.eventDate}</span>
                          </div>
                          <div className="flex items-center gap-4">
                              {status}
                          </div>
                      </li>
                  );
              })}
          </ul>
      </div>
  );
}
