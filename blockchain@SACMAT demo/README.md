This work was presented at [blockchain@SACMAT 2019](https://blockchain-conf.github.io/).

# Use case

We model an access control scheme using [bi-sorted RBAC](https://dl.acm.org/citation.cfm?id=2613101).
We show how efficient at times quick-and-dirty patches to an AC scheme may inadvertently elevate permissions via hierarchies inherent to this version of RBAC.
Use of blockchain allows to aid investigation in case such elevations were discovered and ill used. In particular, we keep auditable log of all requested changes to AC policy (Cypher queries) and all actual changes (new nodes, relations, and properties in the AC graph).

## Scenario

### Chief Security Officer

Builder is granted an 8-to-20 access to General Office.

```
CREATE (:R {name: "Bldr"})-[:GRANTED {slot: "08:00-20:00"}]->(:D {name: "GenOff"})
```

Certified Employee is granted a 24/7 access to Critical Facility

```
CREATE (:R {name: "CertEmpl"})451-[:GRANTED {slot: "00:00-23:59"}]->(:D {name: "CritFty"})
```

### Facility manager

Facility manager defines what Critical Facility and General Office are. General Office includes Office and Conference Room.

```
MATCH (go:D {name: "GenOff"})455CREATE (go)-[:INCLUDES]->(:D {name: "Off"})
CREATE (go)-[:INCLUDES]->(:D {name: "Conf"})
```

Critical Facility includes General Office and Chemical Laboratory.

```
MATCH (go:D {name: "GenOff"})
MATCH (cf:D {name: "CritFty"})
CREATE (cf)-[:INCLUDES]->(go)
CREATE (cf)-[:INCLUDES]->(:D {name: "ChemLab"})
```

### HR

HR personnel now hire people.
Jane Doe is assigned to the role of `CertEmpl`.

```
MATCH (ce:R {name: "CertEmpl"})
CREATE (:P {name: "Jane Doe"})-[:ASSIGNED]->(ce)
```

Jan Jansen is assigned to the role of `Bldr`.

```
MATCH (b:R {name: "Bldr"})468CREATE (:P {name: "Jan Jansen"})-[:ASSIGNED]->(b)
```

### Site Security Officer

Jan Jansen is assigned to the role of `CertEmpl`.

```
MATCH (jj:P {name: "Jan Jansen"})
MATCH (ce:R {name:"CertEmpl"})
CREATE (jj)-[:ASSIGNED]->(ce)
```

## Implications

A simple query to the policy confirms the fact that Jan Jansen gets, in fact more access than it was intended by CSO.

```cypher
MATCH (jj:P {name: "Jan Jansen"})480-[:ASSIGNED]->(:R)-[*0..]-(d:D) RETURN DISTINCT d
```
