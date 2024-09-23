# Registry Lib

This library helps manage complex nested logic by allowing you to provide methods of multiple services within a module, accessible from anywhere in your code, without explicitly defining imports and exports.

## Motivation

When you want to provide a simple API with straightforward methods but need to manage complex logic from multiple unrelated modules, you often end up with tightly coupled code and boilerplate logic (if/else/switch statements). Adding new modules becomes cumbersome as you need to update dependencies and ensure everything integrates correctly.

One solution is to handle this import logic at runtime, for example during the application initialization phase.

This library is a NestJS module that simplifies this process by providing a service to manage such logic efficiently.

## Architecture

### Before

```mermaid
flowchart LR
 subgraph subgraph_cg9e9nt2i["Module B"]
        node_kfe33ckyp("Service B1")
  end
 subgraph subgraph_yb8ozenov["Module C"]
        node_mk2w2fuqc("Service C1")
        nl("Service C2")
        no("Service C3")
  end
 subgraph subgraph_jnetwu4d6["Untitled Service"]
        node_r7ffnxawj["Start method call"]
        ni[/"Read selector key"/]
        nv{{"If key == A"}}
        nj["Call method from Service B1"]
        na{{"If param &gt; 42"}}
        nx["Call method from Serevice C1"]
        n3["Call method from Service C2"]
  end
    nz[\"Module B"/] -- import Service B1 --> nu("Unified Service")
    nh[\"Module C"/] -- import Service C2, Service C3 --> nu
    subgraph_cg9e9nt2i --> nz
    subgraph_yb8ozenov --> nh
    node_mk2w2fuqc --> nl & no
    nu --> subgraph_jnetwu4d6
    node_r7ffnxawj --> ni
    ni --> nv
    nv -- true --> nj
    nv -- false --> na
    na -- true --> n3
    na -- false --> nx
    style node_kfe33ckyp fill:#FFFFFF
    style node_mk2w2fuqc fill:#FFFFFF
    style nl fill:#FFFFFF
    style no fill:#FFFFFF
    style nj fill:#FFE0B2
    style nx fill:#BBDEFB
    style n3 fill:#BBDEFB
    style nz fill:#FFE0B2,stroke:#FFE0B2
    style nh fill:#BBDEFB
    style subgraph_cg9e9nt2i fill:#FFE0B2,stroke:#000000
    style subgraph_yb8ozenov fill:#BBDEFB,stroke:#000000
```

1. All modules bound together.
   With service exports.

    - Module B exports Service B1.
    - Module C exports Service C2 and Service C3.

    And module imports, because to use the method from services Unified Module needs to implicitly import Modules, and inject each service in Unified Service.

    Right now this looks fine, but if you need more than two different modules, that number will grow in the future, the picture starts to look terrifying.

2. Complex if/else/switch logic.
   Unified Service contains if/else/switch logic to decide which method to call based on conditions.
   All this logic leads to hardly readable boilerplate code.

3. Difficult to implement new functionality.
   Adding new features requires modifying the existing conditional logic, increasing the risk of breaking existing functionality.

### After

```mermaid
flowchart LR
 subgraph subgraph_cg9e9nt2i["Module B"]
        node_kfe33ckyp("Service B1")
        nc["@MethodProvider('B')<br>Service B2"]
  end
 subgraph subgraph_yb8ozenov["Module C"]
        node_mk2w2fuqc("Service C1")
        nl("Service C2")
        no("Service C3")
        nn("@MethodProvider('C')<br>Service C4")
  end
 subgraph subgraph_jnetwu4d6["Untitled Service"]
        node_r7ffnxawj["Start method call"]
        ni[/"Read selector key"/]
        nv{{"Is method exist selected for A key?"}}
        nj["Call method from source Service"]
        na["Method not implemented!"]
  end
 subgraph subgraph_gumtihx15["Service C4"]
        node_39obyd0sk["Start method call<br>"]
        n2{{"If param &gt; 42<br>"}}
        ng["Call method from Service C2<br>"]
        n9["Call method from Serevice C1<br>"]
  end
 subgraph subgraph_brtcja9ma["Service B2"]
        node_ijylk29qg["Start method call"]
        nf["Call method from Serevice B1<br>"]
  end
    subgraph_cg9e9nt2i --> nz[\"@ServiceProvider('B')<br>Module B"/]
    subgraph_yb8ozenov --> nh[\"@ServiceProvider('C')<br>Module C"/]
    node_mk2w2fuqc --> nl & no
    nu("Unified Service") --> subgraph_jnetwu4d6
    node_r7ffnxawj --> ni
    ni --> nv
    nv -- true --> nj
    nv -- false --> na
    no --> nn
    nl --> nn
    node_kfe33ckyp --> nc
    n4["RegistryService"] -- Inject --> nu
    nn --> subgraph_gumtihx15
    node_39obyd0sk --> n2
    n2 -- true --> ng
    n2 -- false --> n9
    nc --> subgraph_brtcja9ma
    node_ijylk29qg --> nf
    nr[\"@ServiceProvider('B')<br style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: ﬂ°fff¶ß --tw-ring-color: rgb(59 130 246 / .5); --tw-ring-offset-shadow: 0 0 ﬂ°°0000¶ß --tw-ring-shadow: 0 0 ﬂ°°0000¶ß --tw-shadow: 0 0 ﬂ°°0000¶ß --tw-shadow-colored: 0 0 ﬂ°°0000¶ß --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ;">Module B<br>"/] -. Collected .-o n4
    n6[\"@ServiceProvider('C')<br style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: ﬂ°fff¶ß --tw-ring-color: rgb(59 130 246 / .5); --tw-ring-offset-shadow: 0 0 ﬂ°°0000¶ß --tw-ring-shadow: 0 0 ﬂ°°0000¶ß --tw-shadow: 0 0 ﬂ°°0000¶ß --tw-shadow-colored: 0 0 ﬂ°°0000¶ß --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ;">Module C<br>"/] -. Collected .-o n4
    style node_kfe33ckyp fill:#FFFFFF
    style nc fill:#FFFFFF
    style node_mk2w2fuqc fill:#FFFFFF
    style nl fill:#FFFFFF
    style no fill:#FFFFFF
    style nn fill:#FFFFFF
    style node_39obyd0sk fill:#FFFFFF
    style n2 fill:#FFFFFF
    style ng fill:#FFFFFF
    style n9 fill:#FFFFFF
    style node_ijylk29qg fill:#FFFFFF
    style nf fill:#FFFFFF
    style subgraph_cg9e9nt2i stroke:#000000,fill:#FFE0B2
    style nz fill:#FFE0B2
    style subgraph_yb8ozenov fill:#BBDEFB,stroke:#000000
    style nh fill:#BBDEFB
    style subgraph_gumtihx15 fill:#BBDEFB,stroke:#000000
    style subgraph_brtcja9ma stroke:#000000,fill:#FFE0B2
    style nr stroke-width:4px,stroke-dasharray: 5,fill:#FFE0B2
    style n6 stroke-width:4px,stroke-dasharray: 5,fill:#BBDEFB
```

1. All modules are unrelated.
   These modules don't know about the existence of each other.
   So development on each of them can be independent.
   But this requires additional agreements about how to provide methods to unified service, like a shared list of interfaces that allow implementing the specific method, so that Unified Service will easily detect accessibility of method, etc.

2. All complex if/else/switch needs to be realized within each related module.
   So there need to be defined strict boundaries between modules and Unified Service.
