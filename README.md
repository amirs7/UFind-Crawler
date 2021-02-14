# UFind Crawler
This application can be used to extract information about offered course from [UFind](https://ufind.univie.ac.at/). 
The benefit is that, afte extraction, information about courses is stored in database, which enables queriying on the data.
> Note that it has been only tested for the [Master Computer Science](https://ufind.univie.ac.at/en/vvz_sub.html?path=226927) program

## Usage Example

### Offered courses in summer 2021
After data extraction, you can use the following query to find the name, type, and corresponding clusters of the offered courses in summer 2021:
```sql
select
    course.name as course,
    course.type as type,
    GROUP_CONCAT( cluster.name SEPARATOR ', ' ) as clusters
from
    course_offering
    JOIN course on course.number = course_offering.courseNumber
    JOIN module on course.moduleCode = module.code
    JOIN cluster_modules_module on module.code = cluster_modules_module.moduleCode
    JOIN cluster on cluster.name = cluster_modules_module.clusterName
where 
    course_offering.year = 2021   
    AND course_offering.semester = 'S'
group by 
    course.number
```
