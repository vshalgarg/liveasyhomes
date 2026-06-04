import AnimateIn from "./AnimateIn";

export default function PropertySearch() {
  return (
    <section aria-label="Search rental homes">
      <div className="relative -mt-10 z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimateIn animation="scale-in" delay={100} duration={700}>
            <form
              className="bg-white shadow-xl rounded-2xl sm:rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 hover:shadow-2xl transition-shadow duration-500"
              role="search"
              action="/listings"
              method="get"
            >
              <div>
                <label htmlFor="search-location" className="text-sm text-gray-500">
                  Location
                </label>
                <input
                  id="search-location"
                  name="location"
                  type="text"
                  placeholder="Enter location"
                  autoComplete="address-level2"
                  className="w-full mt-2 min-h-[44px] border-none outline-none text-base sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="search-type" className="text-sm text-gray-500">
                  Property Type
                </label>
                <select
                  id="search-type"
                  name="propertyType"
                  className="w-full mt-2 min-h-[44px] outline-none text-base sm:text-sm bg-transparent"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                </select>
              </div>

              <div>
                <label htmlFor="search-budget" className="text-sm text-gray-500">
                  Budget
                </label>
                <select
                  id="search-budget"
                  name="budget"
                  className="w-full mt-2 min-h-[44px] outline-none text-base sm:text-sm bg-transparent"
                >
                  <option value="">Any Range</option>
                </select>
              </div>

              <div>
                <label htmlFor="search-move-in" className="text-sm text-gray-500">
                  Move In
                </label>
                <input
                  id="search-move-in"
                  name="moveIn"
                  type="date"
                  className="w-full mt-2 min-h-[44px] outline-none text-base sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-[#2B1D13] hover:bg-[#3b2b1f] text-white rounded-2xl px-5 py-4 min-h-[48px] w-full sm:col-span-2 lg:col-span-1 lg:mt-0 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Search Homes
              </button>
            </form>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
