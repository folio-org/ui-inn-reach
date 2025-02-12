# Change history for ui-inn-reach

## [6.0.0] In progress

* Leverage local `renderWIthIntl` utility for unit tests. Refs. UIINREACH-245.
* React v19: refactor away from default props for functional components. Refs UIINREACH-235.
* Owning site paged too long report not honoring "minimum days paged" value. Refs UIINREACH-236.
* *BREAKING* Migrate stripes dependencies to their Sunflower versions. Refs UIINREACH-250.
* *BREAKING* Migrate react-intl to v7. Refs UIINREACH-251.

## [5.0.0] (https://github.com/folio-org/ui-inn-reach/tree/v5.0.0) (2024-11-21)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v4.2.0...v5.0.0)

* *BREAKING* Add several sub-permissions to permission 'INN-Reach App: All permissions'. Refs. UIINREACH-237.

## [4.2.0] (https://github.com/folio-org/ui-inn-reach/tree/v4.2.0) (2024-10-31)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v4.1.0...v4.2.0)

* Refactor away from postcss-color-function. Refs. UIINREACH-233.
* Fix failing unit tests. Refs. UIINREACH-242.

## [4.1.0] (https://github.com/folio-org/ui-inn-reach/tree/v4.1.0) (2024-03-20)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v4.0.0...v4.1.0)

* Several translations have been introduced/updated.

## [4.0.0] (https://github.com/folio-org/ui-inn-reach/tree/v4.0.0) (2023-10-13)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v3.0.0...v4.0.0)

* Remove innReachTransaction.pickupLocationDisplayName token from staff slips. Refs. UIINREACH-222.
* Jest tests failure on master branch. Refs. UIINREACH-224.
* Add PULL_REQUEST_TEMPLATE.md file to the repository. Refs UIINREACH-225.
* Update Node.js to v18 in GitHub Actions. Refs. UIINREACH-228.
* *BREAKING* Upgrade React to v18. Refs. UIINREACH-227.
* Upgrade babel config. Refs. UIINREACH-229.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs UIINREACH-230.

## [3.0.0] (https://github.com/folio-org/ui-inn-reach/tree/v3.0.0) (2022-02-23)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v2.0.3...v3.0.0)
* Bump stripes to 8.0.0 for Orchid/2023-R1. Refs. UIINREACH-215
* Fix test failures caused due to changes in STCOM-1079. Refs. UIINREACH-217
* Upgrade `react-redux` to `v8`. Refs UIINREACH-216.
* INN-Reach paging slips not breaking pages between slips. Fixes UIINREACH-219.

## [2.0.3] (https://github.com/folio-org/ui-inn-reach/tree/v2.0.3) (2022-12-22)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v2.0.2...v2.0.3)

* INN-Reach: Item type to material type mappings (circulation settings) not appearing correctly in Setting UI. Fixes UIINREACH-210
* INN-Reach: Material to item type mapping settings not displaying correctly. Fixes UIINREACH-207
* INN-Reach: FOLIO to INN-Reach locations mapping configuration not displaying properly. Fixes UIINREACH-208
* INN-Reach: Agency to FOLIO location map configuration not displaying correctly. Fixes UIINREACH-209

## [2.0.2] (https://github.com/folio-org/ui-inn-reach/tree/v2.0.2) (2022-12-07)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v2.0.1...v2.0.2)

* update FOLIO_CHECK_OUT_FIELDS. Refs UIINREACH-188.
* Transactions with a link in the Patron ID field are not included in the list of search results by Patron ID. Fixes UIINREACH-200
* support `users` interface version `16.0`. Refs UIINREACH-192.
* @folio/plugin-find-user version is incompatible (out of date). Fixes UIINREACH-201
* query-string is incorrectly listed as a peer-dependency. Fixes UIINREACH-202
* Visible patron ID configuration always includes "User custom fields" selected. Fixes UIINREACH-199
* "Request too long" report does not include PATRON_HOLD transactions without updatedDate. Fixes UIINREACH-205

## [2.0.1] (https://github.com/folio-org/ui-inn-reach/tree/v2.0.1) (2022-09-08)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v2.0.0...v2.0.1)

* FOLIO circulation user for INN-Reach patron type only accepts 10 barcodes as valid (FOLIO implicit limit=10 bug). Refs UIINREACH-195.
* INN-Reach Central Patron Type Mapping Does Not Display all FOLIO Patron Groups for Mapping. Refs UIINREACH-194.

## [2.0.0] (https://github.com/folio-org/ui-inn-reach/tree/v2.0.0) (2022-08-18)
[Full Changelog](https://github.com/folio-org/ui-inn-reach/compare/v1.3.0...v2.0.0)

* STRIPESFF-19: Reset for after submission Refs UIINREACH-193
* components are incorrectly imported directly from stripes-* packages. Refs UIINREACH-191
* Transactions List Action Menu Item: INN-Reach paging s… Refs UIINREACH-164
* Add missing permissions. Refs UIINREACH-187
* BE integration: FOLIO to INN-Reach Locations Settings... Refs UIINREACH-150
* After entering an invalid server name in the server selection field, the "INN-Reach paging slip templates" panel closes and an error message appears. Refs UIINREACH-179
* refactor psets away from backend ".all" permissions. Refs UIINREACH-182
* Edit INN-Reach Paging Slip Templates. Refs UIINREACH-162
* Manage contribution updates Refs UIINREACH-55
* Provide setting to enable/disable lookup of FOLIO serv… Refs UIINREACH-173
* INN-Reach Settings: Manage INN-Reach Paging Slip Templ… Refs UIINREACH-161
* Checkout borrowing site loan actions Refs UIINREACH-170
* INN-Reach Staff Interface: INN-Reach Transaction Detail… Refs  UIINREACH-92
* The List of Local Servers and Their Associated Agencie… Refs UIINREACH-155
* replace babel-eslint with @babel/eslint-parser. Refs UIINREACH-165

## [1.3.0] (https://github.com/folio-org/ui-inn-reach/tree/v1.3.0) (2022-05-03)

* Added transfer status for item cancel hold action. Refs UIINREACH-169.
* Check out to local patron action. Refs UIINREACH-90.
* Check out to borrowing sites result list loan due date information displays the loan date, not the due date. Refs UIINREACH-171.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Item hold) - Transfer hold to another item. Refs UIINREACH-86.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Item hold) - Final check-in. Refs UIINREACH-89.
* Cancel local hold action. Refs UIINREACH-93.
* Error saving configuration for MARC transformation options. Refs UIINREACH-166.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Item hold) - Recall item. Refs UIINREACH-87.
* Cancel item hold. Refs UIINREACH-88.
* Unable to save "Bib Transformation" configuration without modifying MARC 001 field. Refs UIINREACH-158.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Local hold). Refs UIINREACH-70.
* Return patron hold item action. Refs UIINREACH-83.
* Replace react-hot-loader - unmaintained, security (CVE-2021-44906). Refs UIINREACH-160.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Patron hold) - Cancel hold. Refs UIINREACH-81.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Patron hold) - Check Out to Patron. Refs UIINREACH-82.
* In-transit too long report. Refs UIINREACH-136.
* Update INN-Reach Transaction Results List to Sort by Request Date Descending (newest requests first). UIINREACH-156.
* Configure Visible Patron ID Field. Refs UIINREACH-142.
* INN-Reach In-app Report: Returned too Long Report. Refs UIINREACH-135.
* Owning site paged too long report. Refs UIINREACH-133.
* Manage contribution (cancellation): BE integration. Refs UIINREACH-96.
* INN-Reach In-app Report: Borrowing Site Stale Requests Report (Requested too Long). Refs UIINREACH-134.
* INN-Reach In-app Report: Owning Site Overdue (Institutional Overdue Report). Refs UIINREACH-132.
* Unable to specify strip fields and subfields if 'Modify MARC 001 field for contributed records' is not selected. Refs UIINREACH-138.
* INN-Reach Staff Interface: Receive Shipped Item Action: Barcode Augmented Message. Refs UIINREACH-147.
* Checkout to borrowing site item detail view action. Refs UIINREACH-85.
* INN-Reach Staff Interface: Receive Unshipped Item Action: Print Staff Slips. Refs UIINREACH-144.
* FOLIO to INN-Reach Locations Settings Should Group Mappings by INN-Reach Agency. Refs UIINREACH-100.
* INN-Reach Staff Interface: Receive Unshipped Item Action: Barcode Augmented Message. Refs UIINREACH-143.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Patron hold) - Receive item. Refs UIINREACH-79.
* INN-Reach Staff Interface: Receive Shipped Item - modal window behavior. Refs UIINREACH-145.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Patron hold) - Update list of transactions. Refs UIINREACH-141.
* Update the @folio/stripes-cli version. Refs UIINREACH-140.
* INN-Reach Staff Interface: change Modal content on 'Receive Shipped Item' page". Refs UIINREACH-137.
* INN-Reach Staff Interface: Print Slips and Transaction List Action Menus on Receive Shipped Item. Refs UIINREACH-109.
* Checkout to borrowing site. Refs UIINREACH-107.
* Use supported `uuid`. Refs UIINREACH-127.
* UIINREACH-80: INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Patron hold) - Receive Unshipped Item
* UIINREACH-78: INN-Reach Staff Interface: Receive Shipped Item (replace query with parameter)
* UIINREACH-78: INN-Reach Staff Interface: Receive Shipped Item
* BE integration for 'INN-Reach Recall User' setting. Refs UIINREACH-125.
* INN-Reach Record Contribution Settings: Exclude Locations Not Associated with a local Agency Code from the "FOLIO locations to exclude from contribution". Refs UIINREACH-114.

## [1.2.0] (https://github.com/folio-org/ui-inn-reach/tree/v1.2.0) (2021-11-12)

* Added recall user permissions. Refs UIINREACH-117.
* INN-Reach Staff Interface: Filter INN-Reach Transactions by INN-Reach Item Type. Refs UIINREACH-63.
* Inm-reach Permissions. Refs UIINREACH-108.
* INN-Reach Staff Interface: Filter INN-Reach Transactions by INN-Reach Patron Type. Refs UIINREACH-62.
* Central Patron Type to FOLIO Patron Group Setting Should Show Patron Group Name Not Patron Group Description in FOLIO Patron Groups Column. Refs UIINREACH-113.
* INN-Reach Staff Interface: Filter INN-Reach Transactions by Item Agency. Refs UIINREACH-61.
* Use correct `css-loader` syntax. Refs UIINREACH-111.
* INN-Reach Staff Interface: Filter INN-Reach Transactions by Patron Agency. Refs UIINREACH-60.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Item hold). Refs UIINREACH-69.
* When Saving an Central Server Configuration, Validate That Libraries Are Only Assigned to a Single Agency Code. Refs UIINREACH-99.
* INN-Reach Staff Interface: Filter INN-Reach Transactions by Central Server. Refs UIINREACH-59.

## [1.1.0](https://github.com/folio-org/ui-inn-reach/tree/v1.1.0) (2021-10-08)

* Fixed manage contribution error. Refs UIINREACH-98.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View Action Menu (Patron hold). Refs UIINREACH-65.
* Transaction type filter. Refs UIINREACH-57.
* INN-Reach Staff Interface: INN-Reach Transaction Detail View. Refs UIINREACH-64.
* Incorrect titles in the 'central item type' setting. Refs UIINREACH-95.
* INN-Reach General Settings: Add Central Server Code Field to Central Server Connection Configuration Detail/Edit Screens. Refs UIINREACH-77.
* Transactions Search. Refs UIINREACH-53.
* BE integration for Patron Agency Mapping. Refs UIINREACH-76.
* Record Contribution: Provide functionality to cancel record contribution job for INN-Reach. Refs UIINREACH-74.
* Fix Capitalization in INN-Reach Setting UI. Refs UIINREACH-73.

## [1.0.0](https://github.com/folio-org/ui-inn-reach/tree/v1.0.0) (2021-09-17)

* INN-Reach Circulation Settings: Settings Interface for Patron Agency Mapping. Refs UIINREACH-31.
* Update strioes v7 and react to v17. Refs UIINREACH-66.
* INN-Reach Settings: Central Server - Obfuscate API secrets. Refs UIINREACH-68.
* INN-Reach Circulation Settings: Settings Interface for Managing Patron Type to Circulation Patron (User) for Item Holds. Refs UIINREACH-32.
* Backend integration for 'Central item type'. Refs UIINREACH-67.
* Manage current contribution and history. Refs UIINREACH-49, UIINREACH-50.
* INN-Reach Circulation Settings: Settings Interface to manage Central Item Type to FOLIO Material Type for Patron (or Local) Holds. Refs UIINREACH-27.
* INN-Reach Circulation Settings: Settings Interface to manage FOLIO Patron Group to Central Patron Type Patron Verification. Refs UIINREACH-28.
* INN-Reach Settings: For Settings that Require Latest Information from Central Server, Indicate Central Server Configuration Errors and Prevent Editing. Refs UIINREACH-56.
* Record Contribution Settings: Configure MARC Transformation Settings. Refs UIINREACH-23.
* Fixed record update. Refs UIINREACH-54.
* Added validation for material types mapping. Refs UIINREACH-51.
* General INN-Reach Settings UI Enhancements. Refs UIINREACH-43.
* Agency to FOLIO location - incorrect behavior after selecting the local server field placeholder. Refs UIINREACH-48.
* Integrated UI with backend API for item contribution options. Refs UIINREACH-39.
* Folio to inn-reach location: "Are you sure" modal appear wrongly. Refs UIINREACH-46.
* INN-Reach Circulation Settings: Save INN-Reach Agency to FOLIO Location Mappings. Refs UIINREACH-10.
* Material type mappings. Refs UIINREACH-22.
* Add app icon. Refs UIINREACH-41.
* Configure FOLIO Libraries and Shelving Locations to INN-Reach Locations Mapping - create/edit backend integration. Refs UIINREACH-36.
* INN-Reach Record Contribution: Configure Item Contribution Options. Refs UIINREACH-33.
* INN-Reach Record Contribution Settings: Configure FOLIO Libraries and Shelving Locations to INN-Reach Locations Mapping. Refs UIINREACH-21.
* Change the processing of central servers received from the BE. Refs UIINREACH-34.
* INN-Reach Record Contribution Settings: Create Contribution Criteria Settings Form. Refs UIINREACH-19.
* INN-Reach Record Contribution: Create Record Contribution Settings Group. Refs UIINREACH-18.
* Invalid screen size for creating/editing central server configuration. Refs UIINREACH-30.
* Fix display of Borrowed item loan type value. Refs UIINREACH-25.
* INN-Reach locations. Refs UIINREACH-16.
* Central server configuration detail pane BE integration. Refs UIINREACH-25.
* Central server configuration: Create/edit backend integration. Refs UIINREACH-24.
* INN-Reach General Settings: Central Server Connection Configuration. Refs UIINREACH-17.
* Central server configuration detail view. Refs UIINREACH-13.
* INN-Reach General Settings: Central Server Connection Configuration. Refs UIINREACH-12.
* Central servers configuration lists. Refs UIINREACH-11.
* Replace bigtest with jest RTL. Refs UIINREACH-6.
* New app created with stripes-cli
